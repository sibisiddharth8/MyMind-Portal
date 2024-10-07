// Portal.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom'; // Ensure useNavigate is imported
import { useAuth } from '../AuthContext'; // Import AuthContext

// Styled components for the portal page
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bg};
  height: 100dvh;

  @media (max-width: 768px) {
    padding: 20px; /* Adjusted padding for tablet devices */
  }

  @media (max-width: 575px) {
    padding: 15px; /* Further reduced padding for mobile devices */
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.text_primary};
  font-size: 2.5rem; /* Adjusted for better visibility */
  margin-bottom: 40px; /* Increased bottom margin */
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem; /* Responsive font size */
  }

  @media (max-width: 575px) {
    font-size: 1.5rem; /* Further reduced font size for mobile */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased gap for better spacing */
  width: 100%;
  max-width: 500px; /* Increased maximum width for larger buttons */
`;

const NavButton = styled(Link)`
  padding: 15px;
  font-size: 1.1rem; /* Consistent font size */
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  text-decoration: none;
  text-align: center;
  border-radius: 8px; /* Increased border radius for softer look */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Enhanced shadow for depth */
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.button};
    transform: translateY(-2px); /* Subtle lift effect */
  }

  @media (max-width: 768px) {
    font-size: 1rem; /* Responsive font size */
  }

  @media (max-width: 575px) {
    font-size: 0.9rem; /* Further reduced font size for mobile */
  }
`;

const LogoutButton = styled.button`
  padding: 12px;
  font-size: 1.2rem;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 30px; /* Increased margin for spacing above the button */
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.button};
    transform: scale(1.05); /* Slight scale effect on hover */
  }

  @media (max-width: 768px) {
    font-size: 1rem; /* Responsive font size */
  }

  @media (max-width: 575px) {
    font-size: 0.9rem; /* Further reduced font size for mobile */
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Darker overlay for emphasis */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.white};
  padding: 30px; /* Increased padding */
  border-radius: 10px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  width: 90%; /* Full width for small devices */
  max-width: 400px; /* Limit modal width for larger devices */
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px; /* Reduced padding for tablet */
  }

  @media (max-width: 575px) {
    padding: 15px; /* Further reduced padding for mobile */
  }
`;

const ModalButton = styled.button`
  margin-top: 20px; /* Increased margin for separation */
  padding: 12px;
  margin: 15px 20px;
  width: 100px;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.button};
    transform: scale(1.05); /* Slight scale effect on hover */
  }
`;

function Portal() {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { logout } = useAuth(); // Access the logout function from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function
    setModalOpen(false); // Close the modal
    navigate('/'); // Navigate to the login page
  };

  return (
    <Container>
      <Title>Welcome to MyMind - Portal</Title>
      <ButtonContainer>
        <NavButton to="/Bio">Bio</NavButton>
        <NavButton to="/Skills">Skills</NavButton>
        <NavButton to="/Experience">Experience</NavButton>
        <NavButton to="/Projects">Projects</NavButton>
        <NavButton to="/Education">Education</NavButton>
      </ButtonContainer>
      <LogoutButton onClick={() => setModalOpen(true)}>Logout</LogoutButton>

      {/* Modal for Logout Confirmation */}
      {modalOpen && (
        <Overlay>
          <ModalContainer>
            <h2>Are you sure you want to logout?</h2>
            <ModalButton onClick={handleLogout}>Yes, Logout</ModalButton>
            <ModalButton onClick={() => setModalOpen(false)}>Cancel</ModalButton>
          </ModalContainer>
        </Overlay>
      )}
    </Container>
  );
}

export default Portal;
