import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full height for centering */
  background-color: ${({ theme }) => theme.background}; /* Use the theme background color */
  color: ${({ theme }) => theme.text_primary}; /* Use the theme text color */
  text-align: center;
  padding: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem; /* Adjust font size for mobile */
  }
`;

const Message = styled.h1`
  font-size: 2.5rem; /* Default font size */
  color: ${({ theme }) => theme.primary}; /* Theme primary color */

  @media (max-width: 768px) {
    font-size: 2rem; /* Smaller font size for mobile */
  }
`;

const Experience = () => {
  return (
    <Container>
      <Message>Page Under Construction</Message>
    </Container>
  );
};

export default Experience;
