import React, { useState, useEffect } from 'react';
import { database, storage } from '../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, set, get, remove,  onValue } from 'firebase/database';
import styled from 'styled-components';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer';

import Placeholder from '../images/placeholder.png'

const Body = styled.div`
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text_primary};
`;

const Container = styled.div`
  padding: 20px;
  padding-top: 90px;
  max-width: 1200px; /* Increase max width for larger screens */
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  padding: 0 0 40px 0;
  flex-direction: column;
  gap: 20px; /* Increase gap for better spacing */
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1rem; /* Default font size */
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;
  font-size: 1rem; /* Consistent font size */
`;

const CheckboxHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Adjust gap between checkbox and label */
`;

const Checkbox = styled.input`
  width: 16px; /* Adjust the width */
  height: 16px; /* Adjust the height */
`;

const TextArea = styled.textarea`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;
  font-size: 1rem; /* Consistent font size */
  resize: vertical; 
`;


const Button = styled.button`
  padding: 12px 20px; /* Increase padding for better touch target */
  background-color: ${(props) => props.bgColor || props.theme.button};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem; /* Default font size for buttons */
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column; /* Change to column to stack members vertically */
  gap: 15px; /* Add some spacing between members */
  padding: 0 0 40px 0;
`;


const MemberItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Increase gap for better spacing */

  @media (max-width: 768px) {
    flex-direction: column; /* Stack elements vertically on screens smaller than 992px */
    align-items: flex-start; /* Align items to the left */
  }
`;

const MemberImage = styled.img`
  width: 50px; /* Slightly increase image size */
  height: 50px; /* Slightly increase image size */
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
  margin-top: 20px; /* Increase margin for spacing */
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 40px; /* Increase gap for better spacing */

`;

const ProjectCard = styled.div`
  width: 300px;
  height: 100%;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 8px; /* Slightly round corners */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Increase gap for better spacing */
  padding: 20px; /* Increase padding for better spacing */
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Enhanced hover effect */
  }

  @media (max-width: 768px) {
    padding: 15px; /* Reduce padding for mobile */
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  object-fit: cover; /* Maintain aspect ratio */
  border-radius: 8px;
`;

const ProjectDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* Increase gap for better spacing */
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: ${(props) => props.theme.bg};
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  text-align: center;
`;

const ModalButton = styled(Button)`
  margin-top: 20px;
  margin-right: 10px;
`;


const Select = styled.select`
  padding: 12px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;
  font-size: 1rem; /* Consistent font size */
`;

const categories = ['Web', 'Deep Learning', 'Machine Learning']; // Update with your categories

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectImage, setProjectImage] = useState(null);
  const [projectWebapp, setProjectWebapp] = useState('');
  const [projectTags, setProjectTags] = useState('');
  const [members, setMembers] = useState([{ name: '', github: '', linkedin: '', img: '' }]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [ontop, setontop] = useState(false); // New state for isActive
  const [projectToDelete, setProjectToDelete] = useState(null); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bioData, setBioData] = useState({
    name: "",
    description: "",
    roles: [],
    profilepic: "",
    github: "",
    linkedin: "",
    insta: "",
    resume: ""
  });

  useEffect(() => {
    const bioRef = dbRef(database, '/Bio');
    onValue(bioRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBioData(data);
      }
    });
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    const projectsRef = dbRef(database, 'projects');
    get(projectsRef).then((snapshot) => {
      const data = snapshot.val();
      const projectsArray = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setProjects(projectsArray);
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

    if (projectImage) {
        const imageRef = storageRef(storage, `projects/${projectImage.name}`);
        await uploadBytes(imageRef, projectImage).then(async (snapshot) => {
            const imageUrl = await getDownloadURL(snapshot.ref);

            const newProject = {
                title: projectTitle,
                category: projectCategory,
                date: projectDate,
                description: projectDescription,
                github: projectGithub,
                image: imageUrl,
                webapp: projectWebapp,
                tags: projectTags.split(','),
                member: members,
                ontop: ontop ? 1 : 0, // Add isActive attribute
            };

            const projectsRef = dbRef(database, 'projects');
            get(projectsRef).then((snapshot) => {
                const existingProjects = snapshot.val();
                
                // Find the maximum ID from the existing projects and add 1
                const nextId = existingProjects ? Math.max(...Object.keys(existingProjects).map(id => parseInt(id))) + 1 : 0;
                
                set(dbRef(database, `projects/${nextId}`), newProject).then(() => {
                    resetForm();
                    fetchProjects();
                });
            });
        });
    }
};


  const resetForm = () => {
    setProjectTitle('');
    setProjectCategory('');
    setProjectDate('');
    setProjectDescription('');
    setProjectGithub('');
    setProjectImage(null);
    setProjectWebapp('');
    setProjectTags('');
    setMembers([{ name: '', github: '', linkedin: '', img: '' }]);
    setontop(false); // Reset isActive state
  };

  const handleEdit = (project) => {
    window.scrollTo(0,0);
    setIsEditing(true);
    setCurrentProjectId(project.id);
    setProjectTitle(project.title);
    setProjectCategory(project.category);
    setProjectDate(project.date);
    setProjectDescription(project.description);
    setProjectGithub(project.github);
    setProjectWebapp(project.webapp);
    setProjectTags(project.tags.join(','));
    setMembers(project.member);
    setontop(project.ontop === 1); // Set isActive state based on existing project data
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const imageUrl = projectImage ? await uploadImage() : null;

    const updatedProject = {
      title: projectTitle,
      category: projectCategory,
      date: projectDate,
      description: projectDescription,
      github: projectGithub,
      image: imageUrl || projects.find(p => p.id === currentProjectId).image, // Keep old image if no new image uploaded
      webapp: projectWebapp,
      tags: projectTags.split(','),
      member: members,
      ontop: ontop ? 1 : 0, // Add isActive attribute
    };

    set(dbRef(database, `projects/${currentProjectId}`), updatedProject).then(() => {
      resetForm();
      setIsEditing(false);
      fetchProjects();
    });
  };

  const uploadImage = async () => {
    const imageRef = storageRef(storage, `projects/${projectImage.name}`);
    const snapshot = await uploadBytes(imageRef, projectImage);
    return await getDownloadURL(snapshot.ref);
  };

  const handleDelete = (projectId) => {
    setProjectToDelete(projectId);
    setShowDeleteModal(true);
  };

  const handleDeleteClick = (projectId) => {
    handleDelete(projectId);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      // Get the project's data to retrieve the image URL before deletion
      const projectRef = dbRef(database, `projects/${projectToDelete}`);
      get(projectRef).then((snapshot) => {
        const projectData = snapshot.val();
  
        // If the project has an image, delete it from Firebase Storage
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
  
        // After the image is deleted, delete the project data
        remove(projectRef).then(() => {
          fetchProjects(); // Refresh the project list
          setShowDeleteModal(false); // Close the modal
        });
      });
    }
  };

  const handleMemberImageUpload = async (file, index) => {
    if (file) {
      const imageRef = storageRef(storage, `profile_pics/${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const imageUrl = await getDownloadURL(snapshot.ref);
      
      // Update the members array with the new image URL
      const updatedMembers = members.map((member, i) => 
        i === index ? { ...member, img: imageUrl } : member
      );
      setMembers(updatedMembers);
    }
  };
  
  const handleMemberFileChange = (e, index) => {
    const file = e.target.files[0];
    handleMemberImageUpload(file, index);
  };

  const handleDeleteMember = async (index) => {
    const memberToDelete = members[index];
  
    if (memberToDelete.img) {
      // Delete image from Firebase Storage
      const imageRef = storageRef(storage, memberToDelete.img);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting member image: ", error);
      }
    }
  
    // Remove the member from the members array
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  return (
    <Body>
      <Header 
        Title="MyMind | Projects Section"
      />
      <Container>
        <Form onSubmit={isEditing ? handleUpdate : handleImageUpload}>
          <Label>Title :</Label>
          <Input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} required />

          <Label>Category :</Label>
          <Select value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Select>

          <Label>Date :</Label>
          <Input type="text" value={projectDate} onChange={(e) => setProjectDate(e.target.value)} required />

          <Label>Description :</Label>
          <TextArea rows="4" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} required />

          <Label>GitHub URL :</Label>
          <Input type="url" value={projectGithub} onChange={(e) => setProjectGithub(e.target.value)} />

          <Label>Web App URL :</Label>
          <Input type="url" value={projectWebapp} onChange={(e) => setProjectWebapp(e.target.value)} />

          <Label>Tags (comma separated) :</Label>
          <Input type="text" value={projectTags} onChange={(e) => setProjectTags(e.target.value)} />

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
          {projects.map((project) => (
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
          ))}
        </ProjectList>
      </Container>
      <Footer
        footerData={{
          name: bioData.name,
          github: bioData.github,
          linkedin: bioData.linkedin,
          insta: bioData.insta,
        }}
        links=''
      />

      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this project?</p>
            <ModalButton onClick={confirmDelete} bgColor="#f44336">Delete</ModalButton>
            <ModalButton onClick={() => setShowDeleteModal(false)} bgColor="#4caf50">Cancel</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Body>
  );
};

export default Projects;
