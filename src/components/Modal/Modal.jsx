import React from 'react';
import styled from 'styled-components';

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

const Button = styled.button`
  flex: 1; 
  padding: 0.75rem 1rem; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    background-color: #388E3C;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 14px; 
  }
`;

const FeatureButton = styled.button`
  flex: 1; 
  padding: 0.75rem 1rem; 
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  background-color: #f44336;
  color: white;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    background-color: #D32F2F;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 14px; 
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-top: 1rem; 
  gap: 1rem;
`;

function Modal({ title, message, onClose, onFeature, isVisible, showDelete = false, closeOnOverlayClick = true }) {
  if (!isVisible) return null;

  // Handle click outside modal to close it
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <h2>{title || ''}</h2>
        <p>{message || ''}</p>
        <ButtonWrapper>
          {showDelete && <FeatureButton onClick={onFeature}>Delete</FeatureButton>}
          <Button onClick={onClose}>Close</Button>
        </ButtonWrapper>
      </ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
