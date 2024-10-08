import React, { useState, useEffect } from 'react';
import { database, storage } from '../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, set, onValue, remove } from 'firebase/database';
import styled from 'styled-components';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal.jsx';

import LinearLoader from '../components/Loaders/LinearLoader.jsx';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExperience, setNewExperience] = useState({
    company: '',
    date: '',
    desc: '',
    img: '',
    link: '',
    role: '',
    skills: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const experiencesRef = dbRef(database, 'experiences');
    onValue(experiencesRef, (snapshot) => {
      const data = snapshot.val() || [];
      setExperiences(data);
      setLoading(false);
    });
  }, []);

  const handleInputChange = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    let imgUrl = newExperience.img;
    if (selectedImage) {
      const imgRef = storageRef(storage, `experience/${selectedImage.name}`);
      const snapshot = await uploadBytes(imgRef, selectedImage);
      imgUrl = await getDownloadURL(snapshot.ref);
    }

    // Convert skills into an array and handle the case of empty skills
    const skillsArray = newExperience.skills
      ? newExperience.skills
          .split(',')
          .map((skill) => skill.trim()) // Trim spaces
          .filter((skill) => skill !== '') // Filter out empty entries
      : [];

    const experienceData = {
      ...newExperience,
      img: imgUrl,
      skills: skillsArray, // Use the properly formatted array
      id: editingId !== null ? editingId : experiences.length,
    };

    const experienceRef = dbRef(database, `experiences/${experienceData.id}`);
    await set(experienceRef, experienceData);

    setNewExperience({ company: '', date: '', desc: '', img: '', link: '', role: '', skills: '' });
    setSelectedImage(null);
    setEditingId(null);

    setIsUploading(false); 
    setModalType('success'); 
    setModalVisible(true); 
  };

  const handleEdit = (exp) => {
    window.scrollTo(0, 0);
    setNewExperience({
      company: exp.company,
      date: exp.date,
      desc: exp.desc,
      img: exp.img,
      link: exp.link,
      role: exp.role,
      skills: exp.skills ? exp.skills.join(', ') : '',
    });
    setEditingId(exp.id);
  };

  const openDeleteModal = (exp) => {
    setExperienceToDelete(exp);
    setModalType('delete');
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!experienceToDelete) return;

    const experienceRef = dbRef(database, `experiences/${experienceToDelete.id}`);
    await remove(experienceRef);

    if (experienceToDelete.img) {
      const imageRef = storageRef(storage, experienceToDelete.img);
      await deleteObject(imageRef);
    }

    // Close the modal after deletion
    setModalVisible(false);
    setExperienceToDelete(null);
  };

  return (
    <Body>
      <Header Title="MyMind | Experience Section" />
      <Container>
        <Form onSubmit={handleSubmit}>
          {/* Restored form fields */}
          <Label>Company :</Label>
          <Input type="text" name="company" value={newExperience.company} onChange={handleInputChange} required />

          <Label>Date :</Label>
          <Input type="text" name="date" value={newExperience.date} onChange={handleInputChange} required />

          <Label>Role :</Label>
          <Input type="text" name="role" value={newExperience.role} onChange={handleInputChange} required />

          <Label>Description :</Label>
          <Input type="text" name="desc" value={newExperience.desc} onChange={handleInputChange} required />

          <Label>Link :</Label>
          <Input type="url" name="link" value={newExperience.link} onChange={handleInputChange} required />

          <Label>Skills : (comma separated)</Label>
          <Input type="text" name="skills" value={newExperience.skills} onChange={handleInputChange} />

          <Label>Upload Image :</Label>
          <Input type="file" onChange={handleImageChange} accept="image/*" />

          <Button type="submit">{editingId !== null ? 'Update Experience' : 'Add Experience'}</Button>
        </Form>

        {loading ? (
          <LinearLoader
            text = "... Loading Experience ..."
          />
        ) : (
          experiences.map((exp) => (
            <Card key={exp.id}>
              <img src={exp.img} alt={`${exp.company} logo`} />
              <Details>
                <Title>{exp.company}</Title>
                <Role>{exp.role}</Role>
                <p>{exp.date}</p>
              </Details>
              <Actions>
                <button className="edit-btn" onClick={() => handleEdit(exp)}>Edit</button>
                <button className="delete-btn" onClick={() => openDeleteModal(exp)}>Delete</button>
              </Actions>
            </Card>
          ))
        )
        }

        {/* Reusable Modal */}
        <Modal 
          title={modalType === 'delete' ? "Confirm Deletion" : modalType === 'success' ? "Upload Successful!" : "Uploading..."} 
          message={modalType === 'delete' ? "Are you sure you want to delete this experience?" : modalType === 'success' ? "The experience has been saved successfully." : "Please wait while the experience is being uploaded."} 
          isVisible={modalVisible || isUploading} 
          onClose={isUploading ? null : () => setModalVisible(false)}
          onFeature={modalType === 'delete' ? handleDelete : null} 
          showDelete={modalType === 'delete'} 
          showClose={modalType !== 'delete' && !isUploading} 
        />
      </Container>
      <Footer />
    </Body>
  );
};

export default Experience;


const Body = styled.div`
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text_primary};
  padding-top: 90px;
`;

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.bgLight};
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

  img {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    margin-right: 20px;
    object-fit: cover;
  }

  @media (max-width: 575px) {
    flex-direction: column;
    text-align: center;

    img {
      margin: 0 auto 15px auto;
    }
  }
`;

const Details = styled.div`
  flex-grow: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: bold;
`;

const Role = styled.p`
  margin: 5px 0;
  font-size: 16px;
  color: ${(props) => props.theme.text_secondary};
`;

const Actions = styled.div`
  display: flex;
  padding: 10px;
  gap: 10px;

  button {
    padding: 8px 12px;
    width: 100px;
    border-radius: 5px;
    color: ${(props) => props.theme.white};
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .edit-btn {
    background-color: #4caf50;
    &:hover {
      background-color: #388E3C;
    }
  }

  .delete-btn {
    background-color: #f44336;
    &:hover {
      background-color: #D32F2F;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
`;

const Button = styled.button`
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.button};
  border: none;
  color: ${(props) => props.theme.white};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.primary};
    opacity: 0.9;
  }
`;
