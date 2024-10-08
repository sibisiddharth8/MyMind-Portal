import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
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
        <InputContainer>
          <Input
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <ToggleIcon onClick={togglePasswordVisibility}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </ToggleIcon>
        </InputContainer>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Button onClick={handleLogin}>Login</Button>
      </Container>
    );
}

export default Login;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bg};
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 100dvh;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 575px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  color: ${(props) => props.theme.text_primary};
  margin-bottom: 30px; 
  font-size: 2.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 575px) {
    font-size: 1.5rem;
    text-align: center;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  max-width: 400px;
  padding: 15px;
  margin: 15px 0;
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 5px;
  width: 100%;
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

const ToggleIcon = styled.div`
  position: absolute;
  width: 20px;
  top: 53.5%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${({ theme }) => theme.bg};
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.9;
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
