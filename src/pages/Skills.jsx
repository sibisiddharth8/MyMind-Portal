import React, { useState, useEffect } from 'react';
import { database, storage } from '../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as dbRef, set, onValue, remove } from 'firebase/database';
import styled from 'styled-components';
import Header from '../components/Header/Header.jsx'
import Footer from '../components/Footer'
import { Padding } from '@mui/icons-material';

const Body = styled.div`
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text_primary};
`;

const Container = styled.div`
  padding: 20px;
  padding-top: 90px;
  max-width: 900px;
  margin: 0 auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
width: 100%;
  font-weight: bold;
`;

const Input = styled.input`
  margin-left: 15px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;

  @media (max-width: 575px) {
   margin: 5px;
  }
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  margin-left: 15px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;
`;

const Button = styled.button`
  padding: 10px 15px; /* Adjusted padding for buttons */
  background-color: ${(props) => props.bgColor || props.theme.button};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || props.theme.primary};
    transform: scale(1.015);
  }

  @media (max-width: 575px){
    padding: 5px 10px;
    font-size: 14px;
  }
`;

const SkillList = styled.div`
  margin-top: 30px; /* Increased top margin for better separation */
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 5px;
  margin-bottom: 15px; /* Adjusted bottom margin for better spacing */

`;

const SkillActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  > div {
    background: ${(props) => props.theme.bgLight};
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }

  button {
    margin: 5px;
  }
`;

const Skills = () => {
  const [skillName, setSkillName] = useState('');
  const [skillType, setSkillType] = useState('0'); // Default is 0 (Frontend)
  const [skillImage, setSkillImage] = useState(null);
  const [skillsList, setSkillsList] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);
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
  

  // Fetch existing skills
  useEffect(() => {
    const fetchSkills = () => {
      setLoading(true);
      const skillsRef = dbRef(database, 'skills');
      onValue(skillsRef, (snapshot) => {
        const data = snapshot.val();
        setSkillsList(data || {});
        setLoading(false);
      });
    };

    fetchSkills();
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (skillImage) {
      const folderPath = `skills/${skillType}/`;
      const imageRef = storageRef(storage, `${folderPath}${skillImage.name}`);
      
      await uploadBytes(imageRef, skillImage).then(async (snapshot) => {
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Determine the next index for the new skill
        const nextIndex = editingSkillId !== null
          ? editingSkillId
          : Object.keys(skillsList[skillType]?.skills || {}).length;

        const skillData = {
          name: skillName,
          image: imageUrl,
        };

        // Push new skill data to Firebase Database
        await set(dbRef(database, `skills/${skillType}/skills/${nextIndex}`), skillData);

        // Update skillsList state
        setSkillsList((prevSkills) => ({
          ...prevSkills,
          [skillType]: {
            ...prevSkills[skillType],
            skills: {
              ...prevSkills[skillType]?.skills,
              [nextIndex]: skillData,
            },
          },
        }));

        setSkillName('');
        setSkillImage(null);
        setEditingSkillId(null); // Reset the editing state
      }).catch((error) => {
        console.error('Error uploading image:', error);
      });
    }
  };

  const handleDelete = async () => {
    await remove(dbRef(database, `skills/${skillType}/skills/${skillToDelete}`));
    setSkillsList((prevSkills) => {
      const updatedSkills = { ...prevSkills };
      delete updatedSkills[skillType].skills[skillToDelete];
      return updatedSkills;
    });
    setShowDeleteModal(false);
  };

  const handleEdit = (skillType, skillId, skill) => {
    setSkillName(skill.name);
    setSkillImage(null); // Reset image if editing
    setSkillType(skillType);
    setEditingSkillId(skillId);
  };

  return (
    <Body>
      <Header Title='MyMind | Skills Section'/>
      <Container>
      <Form onSubmit={handleImageUpload}>
        <Label>
          Skill Name:
          <Input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />
        </Label>

        <Label>
          Skill Type:
          <Select
            value={skillType}
            onChange={(e) => setSkillType(e.target.value)}
          >
            <option value="0">Frontend</option>
            <option value="1">Backend</option>
            <option value="2">AI/ML</option>
            <option value="3">Others</option>
          </Select>
        </Label>

        <Label>
          Upload Skill Image:
          <Input
            type="file"
            onChange={(e) => setSkillImage(e.target.files[0])}
            accept="image/*"
            required={!editingSkillId}
          />
        </Label>

        <Button type="submit">{editingSkillId !== null ? 'Update Skill' : 'Add Skill'}</Button>
      </Form>

      {loading ? (
        <div></div>
      ) : (
        Object.keys(skillsList).map((type) => (
          <SkillList key={type}>
            <h3>{type === '0' ? 'Frontend :' : type === '1' ? 'Backend :' : type === '2' ? 'AI/ML :' : 'Others :'}</h3>
            {Object.entries(skillsList[type]?.skills || {}).map(([skillId, skill]) => (
              <SkillItem key={skillId}>
                <div>{skill.name}</div>
                <SkillActions>
                  <Button bgColor="#4caf50" hoverColor="#388E3C" onClick={() => handleEdit(type, skillId, skill)}>Edit</Button>
                  <Button bgColor="#f44336" hoverColor="#D32F2F" onClick={() => { setShowDeleteModal(true); setSkillToDelete(skillId); }}>Delete</Button>
                </SkillActions>
              </SkillItem>
            ))}
          </SkillList>
        ))
      )}

      {showDeleteModal && (
        <ConfirmationModal>
          <div>
            <h4>Are you sure you want to delete this skill?</h4>
            <Button bgColor="#4caf50" hoverColor="#388E3C" onClick={handleDelete}>Yes, Delete</Button>
            <Button bgColor="#f44336" hoverColor="#D32F2F" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </div>
        </ConfirmationModal>
      )}
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
    </Body>
  );
};

export default Skills;
