import React, { useState, useEffect } from 'react';
import { database, storage } from '../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref as dbRef, set, onValue, remove } from 'firebase/database';
import styled from 'styled-components';
import Header from '../components/Header/Header.jsx';
import Footer from '../components/Footer';
import Modal from '../components/Modal/Modal.jsx';

const Skills = () => {
  const [skillName, setSkillName] = useState('');
  const [skillType, setSkillType] = useState('0');
  const [skillImage, setSkillImage] = useState(null);
  const [skillsList, setSkillsList] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [skillToDelete, setSkillToDelete] = useState(null);  // State for skill to delete

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

    if (skillImage || editingSkillId !== null) {
        setModalType('upload');
        setModalVisible(true); // Show modal for upload start

        const folderPath = `skills/${skillType}/`;
        const imageRef = storageRef(storage, `${folderPath}${skillImage?.name}`);

        let imageUrl = '';
        if (skillImage) {
            await uploadBytes(imageRef, skillImage).then(async (snapshot) => {
                imageUrl = await getDownloadURL(snapshot.ref);
            }).catch((error) => {
                console.error('Error uploading image:', error);
                setModalVisible(false);
                return;
            });
        }

        const nextIndex = editingSkillId !== null
            ? editingSkillId
            : Object.keys(skillsList[skillType]?.skills || {}).length;

        const skillData = {
            name: skillName,
            image: imageUrl || skillsList[skillType].skills[nextIndex].image,
        };

        await set(dbRef(database, `skills/${skillType}/skills/${nextIndex}`), skillData);

        // Directly update state after adding or editing
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

        // Reset form state
        setSkillName('');
        setSkillImage(null);
        setEditingSkillId(null);

        // Refresh the skills list after the update is done
        const skillsRef = dbRef(database, 'skills');
        onValue(skillsRef, (snapshot) => {
            const data = snapshot.val();
            setSkillsList(data || {});
        });

        setModalType('success');
    } else {
        console.error('No image selected.');
    }
};
  

const handleDelete = async () => {
  const skillData = skillsList[skillType].skills[skillToDelete];
  if (skillData && skillData.image) {
      const imageRef = storageRef(storage, skillData.image);

      await deleteObject(imageRef).catch((error) => {
          console.error('Error deleting image:', error);
      });
  }

  await remove(dbRef(database, `skills/${skillType}/skills/${skillToDelete}`));

  // Remove the deleted skill from the state immediately
  setSkillsList((prevSkills) => {
      const updatedSkills = { ...prevSkills };
      delete updatedSkills[skillType].skills[skillToDelete];
      return updatedSkills;
  });

  // Refresh the skills list from Firebase after deletion
  const skillsRef = dbRef(database, 'skills');
  onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();
      setSkillsList(data || {});
  });

  setModalVisible(false);
  setSkillToDelete(null);  
};

const handleEdit = (skillType, skillId, skill) => {
  window.scrollTo(0, 0);
  setSkillName(skill.name);
  setSkillImage(null); // This allows the image to remain unchanged if the user does not upload a new one
  setSkillType(skillType);
  setEditingSkillId(skillId);

  // Refresh the skills list after editing
  const skillsRef = dbRef(database, 'skills');
  onValue(skillsRef, (snapshot) => {
      const data = snapshot.val();
      setSkillsList(data || {});
  });
};


  const handleDeleteModal = (skillId) => {
    setSkillToDelete(skillId);  // Set the skill ID to delete
    setModalType('delete');
    setModalVisible(true);
  };

  return (
    <Body>
      <Header Title='MyMind | Skills Section'/>
      <Container>
        <Form onSubmit={handleImageUpload}>
          <Label>
            Skill Name:
          </Label>
          <Input
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            required
          />

          <Label>
            Skill Type:
          </Label>
          <Select
            value={skillType}
            onChange={(e) => setSkillType(e.target.value)}
          >
            <option value="0">Frontend</option>
            <option value="1">Backend</option>
            <option value="2">AI/ML</option>
            <option value="3">Others</option>
          </Select>

          <Label>
            Upload Skill Image: 
          </Label>
          <Input
            type="file"
            onChange={(e) => setSkillImage(e.target.files[0])}
            accept="image/*"
            required={!editingSkillId}
          />

          <Button type="submit">{editingSkillId !== null ? 'Update Skill' : 'Add Skill'}</Button>
        </Form>

        {loading ? (
          <div>Loading...</div>
        ) : (
          Object.keys(skillsList).map((type) => (
            <SkillList key={type}>
              <h3>{type === '0' ? 'Frontend :' : type === '1' ? 'Backend :' : type === '2' ? 'AI/ML :' : 'Others :'}</h3>
              {Object.entries(skillsList[type]?.skills || {}).map(([skillId, skill]) => (
                <SkillItem key={skillId}>
                  <div>{skill.name}</div>
                  <SkillActions>
                    <Button bgColor="#4caf50" hoverColor="#388E3C" onClick={() => handleEdit(type, skillId, skill)}>Edit</Button>
                    <Button bgColor="#f44336" hoverColor="#D32F2F" onClick={() => handleDeleteModal(skillId)}>Delete</Button>
                  </SkillActions>
                </SkillItem>
              ))}
            </SkillList>
          ))
        )}

        <Modal
          title={modalType === 'delete' ? "Confirm Deletion" : "Upload Message"}
          message={
            modalType === 'delete'
              ? "Are you sure you want to delete this skill?"
              : modalType === 'upload'
              ? "Your Skill is beign uploaded. Please wait."
              : "Your Skill is uploaded successfully!"
          }
          onFeature={modalType === 'delete' ? handleDelete : null}
          onClose={() => setModalVisible(false)}
          isVisible={modalVisible}
          showDelete={modalType === 'delete'}
        />
      </Container>

      <Footer />
    </Body>
  );
};

export default Skills;


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
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.primary};
  outline: none;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${(props) => props.bgColor || props.theme.button};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.hoverColor || props.theme.primary};
    opacity: 0.9;
  }

  @media (max-width: 575px) {
    font-size: 14px;
  }
`;

const SkillList = styled.div`
  margin-top: 30px;
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.primary};
  border-radius: 5px;
  margin-bottom: 15px;
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
    margin: 20px 10px 0 10px;
  }
`;
