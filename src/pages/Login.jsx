import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import { useAuth } from '../AuthContext.js';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsSigningIn(true);
        setErrorMessage('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/Home');
        } catch (error) {
            setErrorMessage('Incorrect Username / Password. Try Again!');
            console.error('Error logging in:', error.message);
        } finally {
            setIsSigningIn(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container>
            <ContentWrapper>
                <Title>MyMind | Portal</Title>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <Button onClick={handleLogin} disabled={isSigningIn}>
                    {isSigningIn ? <Loader /> : 'Login'}
                </Button>
            </ContentWrapper>
            <Copyright>
              &copy; {new Date().getFullYear()} <StyledSpan>Sibi Siddharth S</StyledSpan>. All rights reserved.
            </Copyright>

        </Container>
    );
}

const Loader = styled.div`
    border: 3px solid ${(props) => props.theme.primary}; 
    border-top: 3px solid ${(props) => props.theme.white}; 
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

export default Login;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  background-color: ${(props) => props.theme.bg};
  padding: 20px;
  position: relative;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 575px) {
    padding: 10px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
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
  width: 100%;
  padding: 15px;
  margin: 15px 0;
  border: 2px solid ${(props) => props.theme.primary};
  border-radius: 5px;
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
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
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

  &:disabled {
    opacity: 0.9;
    cursor: not-allowed;
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
  text-align: center;
  color: red;
  margin-top: 10px;
  font-size: 0.9rem;

  @media (max-width: 575px) {
    font-size: 0.8rem;
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  text-align: center;
  color: ${(props) => props.theme.text_secondary};
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;

  @media (max-width: 575px) {
    font-size: 0.8rem;
  }
`;

const StyledSpan = styled.span`
  color: ${(props) => props.theme.primary};
  font-weight: 500;

  &:hover{
    cursor: pointer;
    opacity: 0.9;
  }
`
