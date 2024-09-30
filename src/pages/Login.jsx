// pages/Login.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.bg};
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 575px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.text_primary};
  margin-bottom: 30px; /* Increased margin for better spacing */
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 575px) {
    font-size: 1.5rem;
    text-align: center;
  }
`;

const Input = styled.input`
  padding: 15px;
  margin: 15px 0; /* Increased margin for better spacing */
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 5px;
  width: 100%;
  max-width: 400px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.button};
    outline: none;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
  }

  @media (max-width: 575px) {
    padding: 10px;
    font-size: 0.85rem;
  }
`;

const Button = styled.button`
  padding: 15px;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px; /* Added margin for spacing above the button */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.button};
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 0.9rem;
  }

  @media (max-width: 575px) {
    padding: 10px;
    font-size: 0.85rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
  font-size: 0.9rem;

  @media (max-width: 575px) {
    font-size: 0.8rem;
  }
`;

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Access the login function from AuthContext
  
    const handleLogin = () => {
      const validUsername = process.env.REACT_APP_USERNAME;
      const validPassword = process.env.REACT_APP_PASSWORD;

      if (username === validUsername && password === validPassword) {
        login(); // Update authentication state
        navigate('/Home'); // Redirect to the portal
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    };
  
    return (
      <Container>
        <Title>MyMind | Portal</Title>
        <Input
          type="text"
          placeholder="Username / Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Button onClick={handleLogin}>Login</Button>
      </Container>
    );
}

export default Login;