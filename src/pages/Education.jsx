import React, { useState, useEffect } from 'react';
import { database, storage } from '../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, set, onValue, remove } from 'firebase/database';
import styled from 'styled-components';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal.jsx';
import LinearLoader from '../components/Loaders/LinearLoader.jsx';

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [neweducation, setNeweducation] = useState({
    date: '',
    degree: '',
    grade: '',
    desc: '',
    img: '',
    school: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const educationsRef = dbRef(database, 'education');
    onValue(educationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const educationList = Object.keys(data).map((key) => ({
          id: key,  
          ...data[key],  
        }));
        setEducations(educationList);
      } else {
        setEducations([]); 
      }
      setLoading(false);
    });
  }, []);
  

  const handleInputChange = (e) => {
    setNeweducation({ ...neweducation, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prevent multiple submissions
    if (isUploading) return;
  
    setIsUploading(true); // Set uploading state to true
  
    let imgUrl = neweducation.img;
  
    // Handle image upload if a new image is selected
    if (selectedImage) {
      const imgRef = storageRef(storage, `education/${selectedImage.name}`);
      const snapshot = await uploadBytes(imgRef, selectedImage);
      imgUrl = await getDownloadURL(snapshot.ref);
    }
  
    // Generate a new id based on the current list of education entries
    const newId = editingId !== null 
      ? editingId 
      : educations.length > 0 
        ? Math.max(...educations.map(edu => Number(edu.id))) + 1 
        : 0;
  
    // Create a new entry or update the existing one
    const educationData = {
      ...neweducation,
      img: imgUrl,
      id: newId,
    };
  
    // Save to Firebase Database
    const educationRef = dbRef(database, `education/${educationData.id}`);
    await set(educationRef, educationData);
  
    // Reset form and states after submission
    setNeweducation({ date: '', degree: '', grade: '', desc: '', img: '', school: '' });
    setSelectedImage(null);
    setEditingId(null);
    setIsUploading(false); // Set uploading state to false
  
    // Display success modal
    setModalType('success');
    setModalVisible(true);
  };
  
  

  const handleEdit = (edu) => {
    window.scrollTo(0, 0);
    setNeweducation({
      date: edu.date,
      degree: edu.degree,
      grade: edu.grade,
      desc: edu.desc,
      img: edu.img,
      school: edu.school,
    });
    setEditingId(edu.id);
  };

  const openDeleteModal = (edu) => {
    setEducationToDelete(edu);
    setModalType('delete');
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (!educationToDelete) return;

    const educationRef = dbRef(database, `education/${educationToDelete.id}`);
    await remove(educationRef);

    if (educationToDelete.img) {
      const imageRef = storageRef(storage, educationToDelete.img);
      await deleteObject(imageRef);
    }

    setModalVisible(false);
    setEducationToDelete(null);
  };

  return (
    <Body>
      <Header Title="MyMind | Education Section" />
      <Container>
        <Form onSubmit={handleSubmit}>
          <Label>School / College:</Label>
          <Input type="text" name="school" value={neweducation.school} onChange={handleInputChange} required />

          <Label>Degree:</Label>
          <Input type="text" name="degree" value={neweducation.degree} onChange={handleInputChange} required />
          
          <Label>Date:</Label>
          <Input type="text" name="date" value={neweducation.date} onChange={handleInputChange} required />

          <Label>Grade:</Label>
          <Input type="text" name="grade" value={neweducation.grade} onChange={handleInputChange} required />

          <Label>Description:</Label>
          <Input type="text" name="desc" value={neweducation.desc} onChange={handleInputChange} required />

          <Label>Logo :</Label>
          <Input type="file" onChange={handleImageChange} accept="image/*" />

          <Button type="submit">{editingId !== null ? 'Update Education' : 'Add Education'}</Button>
        </Form>

        {loading ? (
          <LinearLoader 
            text = "... Loading Education ..."
          />
        ) :
        educations.map((edu) => (
          <Card key={edu.id}>
            <img src={edu.img} alt={`${edu.school} logo`} />
            <Details>
              <Title>{edu.school}</Title>
              <Role>{edu.degree}</Role>
              <p>{edu.date}</p>
            </Details>
            <Actions>
              <button className="edit-btn" onClick={() => handleEdit(edu)}>Edit</button>
              <button className="delete-btn" onClick={() => openDeleteModal(edu)}>Delete</button>
            </Actions>
          </Card>
        ))}

        <Modal 
          title={modalType === 'delete' ? "Confirm Deletion" : modalType === 'success' ? "Upload Successful!" : "Uploading..."} 
          message={modalType === 'delete' ? "Are you sure you want to delete this education?" : modalType === 'success' ? "The Education has been saved successfully." : "Please wait while the Education is being uploaded."} 
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

export default Education;

// Styled components
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
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
`;

const Button = styled.button`
  padding: 10px;
  background-color: ${(props) => props.theme.button};
  border: none;
  color: ${(props) => props.theme.white};
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) => props.theme.primary};
    opacity: 0.9;
  }
`;
