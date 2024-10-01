import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, remove } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database,  storage } from '../FirebaseConfig';
import styled from 'styled-components';

import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer'

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  padding-bottom: 1rem;
`;

const BioPortal = styled.div`
  max-width: 900px;
  margin: auto;
  padding-top: 80px;

  @media (max-width: 768px) {
    padding-top: 40;
  }
`;

const BioContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ProfilePic = styled.img`
  width: 180px;
  height: 180px;
  border: 2px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  margin: auto;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const InputField = styled.input`
  padding: 0.75rem;
  border: 1.5px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.text_primary};
  font-size: 16px;
  color: ${({ theme }) => theme.black};

  &:focus {
    outline: none;
    border-width: 2px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 14px;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.text_primary};
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  border-radius: 4px;
  border-color: ${({ theme }) => theme.primary};
  font-size: 16px;
  resize: vertical;

  &:focus {
    border-width: 2px;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 14px;
  }
`;

// Styled label component
const StyledLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.text_primary};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-top: 1rem; 
  padding: 1rem;
  gap: 1rem;
`;

const Button = styled.button`
  flex: 1; 
  padding: 0.75rem 1rem; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background-color: ${(props) => props.bgColor || '#2196F3'};
  color: white;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || '#1976D2'};
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 14px; 
  }
`;


const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;

  h2 {
    margin-bottom: 1rem;
    font-size: 24px;
  }

  p {
    margin-bottom: 1.5rem;
  }

  button {
    margin: 0.5rem;
  }
`;

const FileUploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadButtonLabel = styled.label`
  padding: 0.75rem 1rem;
  border: 1.5px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.button};
  color: ${({ theme }) => theme.white};
  font-size: 16px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.primary};
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 14px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileNameDisplay = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
  text-align: left;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

function Bio() {
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

  const [showModal, setShowModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null); 
  const [isUploading, setIsUploading] = useState(false); 

  useEffect(() => {
    const bioRef = ref(database, '/Bio');
    onValue(bioRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBioData(data);
      }
    });
  }, []);

  const handleSave = () => {
    const bioRef = ref(database, '/Bio');
    update(bioRef, bioData);
  };

  const handleDelete = () => {
    const bioRef = ref(database, '/Bio');
    remove(bioRef);
    setBioData({
      name: "",
      description: "",
      roles: [],
      profilepic: "",
      github: "",
      linkedin: "",
      insta: "",
      resume: ""
    });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBioData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRolesChange = (e) => {
    setBioData((prevData) => ({
      ...prevData,
      roles: e.target.value.split(','),
    }));
  };

  const handleDeleteConfirmation = () => {
    setShowModal(true);
  };

  const handleFileUpload = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const uploadResume = async () => {
    if (resumeFile) {
      setIsUploading(true); // Indicate that upload is happening
      const storageRefInstance = storageRef(storage, `resumes/${resumeFile.name}`);
      await uploadBytes(storageRefInstance, resumeFile);
      const downloadURL = await getDownloadURL(storageRefInstance);
      setBioData((prevData) => ({
        ...prevData,
        resume: downloadURL, // Update resume link in state
      }));
      setIsUploading(false); // Upload is complete
    }
  };

  // Monitor changes to bioData.resume and save to Firebase only after it is updated
  useEffect(() => {
    if (!isUploading && bioData.resume) {
      handleSave();
    }
  }, [bioData.resume]); // Trigger when resume link changes

  const handleSaveWithUpload = async () => {
    if (resumeFile) {
      await uploadResume(); // Wait until the upload is finished
    } else {
      handleSave(); // If no file, save the bio data as usual
    }
  };

  return (
    <Body>
      <Header Title="MyMind | Bio Section" />
      <BioPortal>
        <BioContent>
          {bioData.profilepic && (
            <ProfilePic src={bioData.profilepic} alt="Profile" />
          )}
          <Title>Bio Information</Title>

          <StyledLabel htmlFor="name">Name:</StyledLabel>
          <InputField
            type="text"
            name="name"
            id="name"
            value={bioData.name}
            onChange={handleChange}
            placeholder="Enter Name"
          />

          <StyledLabel htmlFor="description">Description:</StyledLabel>
          <TextArea
            name="description"
            id="description"
            value={bioData.description}
            onChange={handleChange}
            placeholder="Enter Description"
            rows="4"
          />

          <StyledLabel htmlFor="roles">Roles (comma separated):</StyledLabel>
          <InputField
            type="text"
            name="roles"
            id="roles"
            value={bioData.roles.join(',')}
            onChange={handleRolesChange}
            placeholder="Enter Roles"
          />

          <StyledLabel htmlFor="profilepic">Profile Picture URL:</StyledLabel>
          <InputField
            type="text"
            name="profilepic"
            id="profilepic"
            value={bioData.profilepic}
            onChange={handleChange}
            placeholder="Enter Profile Picture URL"
          />

          <StyledLabel htmlFor="github">GitHub URL:</StyledLabel>
          <InputField
            type="text"
            name="github"
            id="github"
            value={bioData.github}
            onChange={handleChange}
            placeholder="Enter GitHub URL"
          />

          <StyledLabel htmlFor="linkedin">LinkedIn URL:</StyledLabel>
          <InputField
            type="text"
            name="linkedin"
            id="linkedin"
            value={bioData.linkedin}
            onChange={handleChange}
            placeholder="Enter LinkedIn URL"
          />

          <StyledLabel htmlFor="insta">Instagram URL:</StyledLabel>
          <InputField
            type="text"
            name="insta"
            id="insta"
            value={bioData.insta}
            onChange={handleChange}
            placeholder="Enter Instagram URL"
          />

          <StyledLabel htmlFor="resume">Resume Upload:</StyledLabel>
          <FileUploadWrapper>
            <UploadButtonLabel htmlFor="file-upload">Upload Resume</UploadButtonLabel>
            <HiddenFileInput 
              type="file" 
              accept=".pdf" 
              id="file-upload" 
              onChange={handleFileUpload} 
            />
            {resumeFile && <FileNameDisplay>{resumeFile.name}</FileNameDisplay>}
          </FileUploadWrapper>
        </BioContent>

        <ButtonWrapper>
          <Button bgColor="#4caf50" hoverColor="#388E3C" onClick={handleSaveWithUpload}>
              Save
            </Button>
            <Button bgColor="#f44336" hoverColor="#D32F2F" onClick={handleDeleteConfirmation}>
              Delete
          </Button>
        </ButtonWrapper>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this bio?</p>
              <Button bgColor="#f44336" hoverColor="#D32F2F" onClick={handleDelete}>
                Confirm
              </Button>
              <Button bgColor="#4caf50" hoverColor="#388E3C" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </ModalContent>
          </ModalOverlay>
        )}
        
        <Footer
          footerData={{
            name: bioData.name,
            github: bioData.github,
            linkedin: bioData.linkedin,
            insta: bioData.insta,
          }}
          links=''
        />
      </BioPortal>

    </Body>
  );
}

export default Bio;
