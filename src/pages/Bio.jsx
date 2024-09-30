import React, { useState, useEffect } from 'react';
import { ref, onValue, set, update, remove } from "firebase/database";
import { database } from '../FirebaseConfig';
import styled from 'styled-components';

const BioPortal = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1rem;
  }
`;

const BioContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 1rem;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ProfilePic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

const InputField = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #2196F3;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 14px;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;

  &:focus {
    border-color: #2196F3;
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 14px;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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
    padding: 0.5rem 1rem;
    font-size: 14px;
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

  const [isEditing, setIsEditing] = useState(false);

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
    if (isEditing) {
      update(bioRef, bioData);
    } else {
      set(bioRef, bioData);
    }
    setIsEditing(false);
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

  return (
    <BioPortal>
      <BioContent>
        {bioData.profilepic && (
          <ProfilePic
            src={bioData.profilepic}
            alt="Profile"
          />
        )}
        <Title>Bio Information</Title>

        <label htmlFor="name">Name:</label>
        <InputField
          type="text"
          name="name"
          id="name"
          value={bioData.name}
          onChange={handleChange}
          placeholder="Enter Name"
        />

        <label htmlFor="description">Description:</label>
        <TextArea
          name="description"
          id="description"
          value={bioData.description}
          onChange={handleChange}
          placeholder="Enter Description"
          rows="4"
        />

        <label htmlFor="roles">Roles (comma separated):</label>
        <InputField
          type="text"
          name="roles"
          id="roles"
          value={bioData.roles.join(',')}
          onChange={handleRolesChange}
          placeholder="Enter Roles"
        />

        <label htmlFor="profilepic">Profile Picture URL:</label>
        <InputField
          type="text"
          name="profilepic"
          id="profilepic"
          value={bioData.profilepic}
          onChange={handleChange}
          placeholder="Enter Profile Picture URL"
        />

        <label htmlFor="github">GitHub URL:</label>
        <InputField
          type="text"
          name="github"
          id="github"
          value={bioData.github}
          onChange={handleChange}
          placeholder="Enter GitHub URL"
        />

        <label htmlFor="linkedin">LinkedIn URL:</label>
        <InputField
          type="text"
          name="linkedin"
          id="linkedin"
          value={bioData.linkedin}
          onChange={handleChange}
          placeholder="Enter LinkedIn URL"
        />

        <label htmlFor="insta">Instagram URL:</label>
        <InputField
          type="text"
          name="insta"
          id="insta"
          value={bioData.insta}
          onChange={handleChange}
          placeholder="Enter Instagram URL"
        />

        <label htmlFor="resume">Resume URL:</label>
        <InputField
          type="text"
          name="resume"
          id="resume"
          value={bioData.resume}
          onChange={handleChange}
          placeholder="Enter Resume URL"
        />

        <Button bgColor="#4caf50" hoverColor="#388E3C" onClick={handleSave}>
          {isEditing ? 'Update Bio' : 'Add Bio'}
        </Button>
        <Button bgColor="#2196F3" hoverColor="#1976D2" onClick={() => setIsEditing(true)}>
          Edit Bio
        </Button>
        <Button bgColor="#f44336" hoverColor="#D32F2F" onClick={handleDelete}>
          Delete Bio
        </Button>
      </BioContent>
    </BioPortal>
  );
}

export default Bio;
