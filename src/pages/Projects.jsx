import React, { useState, useEffect } from 'react';
import { database, storage } from '../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, set, get, remove,  onValue } from 'firebase/database';
import styled from 'styled-components';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer';

import Placeholder from '../images/placeholder.png'
import Modal from '../components/Modal/Modal.jsx'

import LinearLoader from '../components/Loaders/LinearLoader.jsx';

const categories = ['Web', 'Deep Learning', 'Machine Learning'];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectid, setProjectid] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectImage, setProjectImage] = useState(null);
  const [projectWebapp, setProjectWebapp] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [projectRank, setProjectRank] = useState('');
  const [members, setMembers] = useState([{ name: '', github: '', linkedin: '', img: '' }]);
  const [isEditing, setIsEditing] = useState(false);
  const [ontop, setontop] = useState(false); 
  const [projectToDelete, setProjectToDelete] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    const projectsRef = dbRef(database, 'projects');
    get(projectsRef).then((snapshot) => {
      const data = snapshot.val();
      const projectsArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProjects(projectsArray);
      setLoading(false);
    });
  };

  const addMember = () => {
    setMembers([...members, { name: '', github: '', linkedin: '', img: '' }]);
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = members.map((member, i) => (i === index ? { ...member, [field]: value } : member));
    setMembers(updatedMembers);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
  
    if (isEditing) {
      handleUpdate(e);
      return;
    }
  
    // Upload member images first before uploading the project image
    await Promise.all(members.map(async (member, index) => {
      if (member.img) {
        const imageRef = storageRef(storage, `profile_pics/${member.img.name}`);
        const snapshot = await uploadBytes(imageRef, member.img);
        const imageUrl = await getDownloadURL(snapshot.ref);
  
        // Update the member image URL
        handleMemberChange(index, 'img', imageUrl);
      }
    }));
  
    // Now upload the project image
    if (projectImage) {
      setModalType('upload');
      setModalVisible(true);
      const imageRef = storageRef(storage, `projects/${projectImage.name}`);
      await uploadBytes(imageRef, projectImage).then(async (snapshot) => {
        const imageUrl = await getDownloadURL(snapshot.ref);
  
        const rank = projectRank ? parseInt(projectRank, 10) : 0;
        const newProject = {
          title: projectTitle,
          id: '', // id will be assigned below
          category: projectCategory,
          date: projectDate,
          description: projectDescription,
          github: projectGithub,
          image: imageUrl,
          webapp: projectWebapp,
          tags: projectTags.split(','),
          rank: rank,
          member: members,
          ontop: ontop ? 1 : 0,
        };
  
        const projectsRef = dbRef(database, 'projects');
        get(projectsRef).then((snapshot) => {
          const existingProjects = snapshot.val();
  
          // Determine the next sequential id
          const nextId = existingProjects ? Math.max(...Object.keys(existingProjects).map(id => parseInt(id))) + 1 : 0;
  
          set(dbRef(database, `projects/${nextId}`), { ...newProject, id: nextId }).then(() => {
            resetForm();
            fetchProjects();
          });
        });
      });
      setModalType('success');
    }
  };
  

  const resetForm = () => {
    setProjectTitle('');
    setProjectid('')
    setProjectCategory('');
    setProjectDate('');
    setProjectDescription('');
    setProjectGithub('');
    setProjectImage(null);
    setProjectWebapp('');
    setProjectTags('');
    setProjectRank('');
    setMembers([{ name: '', github: '', linkedin: '', img: '' }]);
    setontop(false);
  };


  const handleEdit = (project) => {
    window.scrollTo(0,0);
    setIsEditing(true);
    setProjectid(project.id);
    setProjectTitle(project.title);
    setProjectCategory(project.category);
    setProjectDate(project.date);
    setProjectDescription(project.description);
    setProjectGithub(project.github);
    setProjectWebapp(project.webapp);
    setProjectTags(project.tags.join(','));
    setProjectRank(project.rank);
    setMembers(project.member);
    setontop(project.ontop === 1);
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    setModalType('upload');
    setModalVisible(true);
  
    const currentProject = projects.find(p => p.id === projectid);
  
    let imageUrl = currentProject.image; // Preserve existing image if not updated
    if (projectImage) {
      imageUrl = await uploadImage();
    }
  
    const rank = projectRank ? parseInt(projectRank, 10) : 0; // Add this line
  
    const updatedProject = {
      id: projectid,  // Use the original project id
      title: projectTitle,
      category: projectCategory,
      date: projectDate,
      description: projectDescription,
      github: projectGithub,
      image: imageUrl,
      webapp: projectWebapp,
      tags: projectTags.split(','),
      rank: rank, 
      member: members,
      ontop: ontop ? 1 : 0,
    };
  
    await set(dbRef(database, `projects/${projectid}`), updatedProject);
    resetForm();
    setIsEditing(false);
    fetchProjects(); // Re-fetch projects after updating
    setModalType('success');
  };
  


  const uploadImage = async () => {
    const imageRef = storageRef(storage, `projects/${projectImage.name}`);
    const snapshot = await uploadBytes(imageRef, projectImage);
    return await getDownloadURL(snapshot.ref);
  };

  const handleDelete = (projectId) => {
    setProjectToDelete(projectId);
  };

  const handleDeleteClick = (projectId) => {
    handleDelete(projectId);
    setModalType('delete');
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      const projectRef = dbRef(database, `projects/${projectToDelete}`);
      get(projectRef).then((snapshot) => {
        const projectData = snapshot.val();
        if (projectData && projectData.image) {
          const imageRef = storageRef(storage, projectData.image);
          deleteObject(imageRef)
            .then(() => {
              console.log('Image deleted successfully');
            })
            .catch((error) => {
              console.error('Error deleting image:', error);
            });
        }
        remove(projectRef).then(() => {
          fetchProjects();
          setModalVisible(false);
        });
      });
    }
};

const handleMemberImageUpload = async (file, index) => {
  if (file) {
    const member = members[index];

    // Check if the member already has an image
    if (member.img) {
      // If the member has an existing image, use the existing image URL
      const updatedMembers = members.map((m, i) => 
        i === index ? { ...m, img: member.img } : m
      );
      setMembers(updatedMembers);
    } else {
      // If the member doesn't have an image, upload the new image
      const imageRef = storageRef(storage, `profile_pics/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const updatedMembers = members.map((m, i) => 
        i === index ? { ...m, img: imageUrl } : m
      );
      setMembers(updatedMembers);
    }
  }
};

const handleMemberFileChange = (e, index) => {
  const file = e.target.files[0];
  handleMemberImageUpload(file, index);
};

const handleDeleteMember = async (index) => {
  if (members.length > 1) {
    try {
      // Get the member to delete
      const memberToDelete = members[index];
      console.log("Deleting member:", memberToDelete);

      // Create a new members array without the member being deleted
      const updatedMembers = members.filter((_, i) => i !== index);

      // Log the updated members array
      console.log("Updated members array:", updatedMembers);

      // Update the project in the database
      const projectRef = dbRef(database, `projects/${projectid}`);
      
      // Fetch the current project data to maintain other properties
      const projectSnapshot = await get(projectRef);
      const currentProjectData = projectSnapshot.val();
      
      // Update the project members in the database
      await set(projectRef, {
        ...currentProjectData,
        member: updatedMembers
      });

      // Update local state to reflect the deleted member
      setMembers(updatedMembers);
      console.log("Member deleted successfully in Firebase.");
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  } else {
    console.log("Cannot delete member, at least one member required.");
  }
};

  return (
    <Body>
      <Header 
        Title="MyMind | Projects Section"
      />
      <Container>
        <Form onSubmit={isEditing ? handleUpdate : handleImageUpload}>
          <Label>Project Title :</Label>
          <Input type="text" placeholder='MyMind | Portfolio' value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required />

          <Label>Category :</Label>
          <Select value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Select>

          <Label>Date :</Label>
          <Input type="text" placeholder='Jan 20XX - Dec 20XX' value={projectDate} onChange={(e) => setProjectDate(e.target.value)} required />

          <Label>Description :</Label>
          <TextArea rows="4" placeholder='Enter Project Description' value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required />

          <Label>Rank :</Label>
          <Input type="number" placeholder="Rank" value={projectRank} onChange={(e) => setProjectRank(e.target.value)} />

          <Label>GitHub URL :</Label>
          <Input type="url" placeholder='https://github.com/username' value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} />

          <Label>Web App URL :</Label>
          <Input type="url" placeholder='https://sibisiddharth8.github.io/reponame/' value={projectWebapp} onChange={(e) => setProjectWebapp(e.target.value)} />

          <Label>Tags (comma separated) :</Label>
          <Input type="text" placeholder='tag1, tag2, tag3' value={projectTags} onChange={(e) => setProjectTags(e.target.value)} />

          <Label>Project Image :</Label>
          <Input type="file" accept="image/*" onChange={(e) => setProjectImage(e.target.files[0])}/>

          <Label>Team List :</Label>
          <MemberList>
          {members.map((member, index) => (
            <MemberItem key={index}>
            <MemberImage src={member.img || Placeholder} alt={member.name || 'Member'} />
            <Input
              type="text"
              placeholder="Name"
              value={member.name}
              onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
            />
            <Input
              type="url"
              placeholder="GitHub URL"
              value={member.github}
              onChange={(e) => handleMemberChange(index, 'github', e.target.value)}
            />
            <Input
              type="url"
              placeholder="LinkedIn URL"
              value={member.linkedin}
              onChange={(e) => handleMemberChange(index, 'linkedin', e.target.value)}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleMemberFileChange(e, index)}
            />

            <ButtonWrapper>
              <AddMemberButton type="button" onClick={addMember}>Add</AddMemberButton>
              <DeleteButton onClick={() => handleDeleteMember(index)} bgColor="#f44336">Delete</DeleteButton>
            </ButtonWrapper>
          </MemberItem>
          
          ))}
          
        </MemberList>

        <CheckboxHolder>
          <Label>Show Project on Home Page :</Label>
          <Checkbox type="checkbox" checked={ontop} onChange={() => setontop(!ontop)} />
        </CheckboxHolder>
          
        <Button type="submit">{isEditing ? 'Update Project' : 'Add Project'}</Button>

        </Form>

        <h2>Project List :</h2>
        <ProjectList>
          {loading ? (
            <LinearLoader
              text = "... Loading Projects ..."
            />
          ) : (
          projects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectImage src={project.image} alt={project.title} />
              <ProjectDetails>
                <h3>{project.title}</h3>
                <p>Category: {project.category}</p>
              </ProjectDetails>
              <ButtonWrapper>
                <EditButton onClick={() => handleEdit(project)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDeleteClick(project.id)}>Delete</DeleteButton>
              </ButtonWrapper>
            </ProjectCard>
          )))
          }
        </ProjectList>
      </Container>
      <Footer/>

      <Modal
          title={
            modalType === 'delete' ? "Confirm Deletion" 
            : modalType === 'upload' ? "Uploading..." 
            : "Upload Successful"
          }

          message={
            modalType === 'delete' ? "Are you sure you want to delete this Project?"
              : modalType === 'upload' ? "Your data is being uploaded. Please wait." : "Your data has been uploaded successfully!"
            }

          onFeature={modalType === 'delete' ? confirmDelete : null}
          onClose={() => setModalVisible(false)}
          isVisible={modalVisible}
          showDelete={modalType === 'delete'} 
        />
    </Body>
  );
};

export default Projects;

const Body = styled.div`
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text_primary};
`;

const Container = styled.div`
  padding: 20px;
  padding-top: 90px;
  max-width: 1020px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  padding: 0 0 40px 0;
  flex-direction: column;
  gap: 20px; 
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1rem; 
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1.5px solid ${(props) => props.theme.primary};
  outline: none;
  width: 100%;
`;

const CheckboxHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px; 
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.text_primary};
  border-radius: 4px;
  border: 1.5px solid ${(props) => props.theme.primary};
  resize: vertical;
  outline: none;
`;

const Button = styled.button`
  padding: 12px 20px; 
  background-color: ${(props) => props.bgColor || props.theme.button};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem; 
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column; 
  gap: 15px; 
  padding: 0 0 40px 0;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; 

  @media (max-width: 768px) {
    flex-direction: column; 
    align-items: flex-start; 
  }
`;

const MemberImage = styled.img`
  width: 50px; 
  height: 50px; 
  border-radius: 50%;
`;

const AddMemberButton = styled(Button)`
  width: 100%;
  background-color: ${(props) => props.theme.primary};
  background-color: #4caf50;

  &:hover{
    background-color: #388E3C;
  }
`;

const ProjectList = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px; 

`;

const ProjectCard = styled.div`
  width: 300px;
  height: 100%;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 15px; 
  padding: 20px; 
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 15px; 
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  object-fit: cover; 
  border-radius: 8px;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const EditButton = styled(Button)`
  background-color: #4caf50;
  width: 100%;

  &:hover{
    background-color: #388E3C;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;
  width: 100%;

  &:hover{
    background-color: #D32F2F;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1.5px solid ${(props) => props.theme.primary};
  outline: none;
`;