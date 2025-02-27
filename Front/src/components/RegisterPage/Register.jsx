import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api/api';
import Cookies from 'js-cookie';

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  margin: auto;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  width: 50%;

  &:hover {
    background-color: #45a049;
  }
`;

const LoginButton = styled(Button)`
  margin-top: 20px;
  background-color: #262c7c;

  &:hover {
    background-color: hsl(261, 42%, 43%);
  }
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

const RegisterHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
`;

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', formData);
      const userId = response.data.user.id;
      Cookies.set('userId', userId, { expires: 1 });
      navigate(`/character-classes`);
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        console.error('Registration failed', error);
      }
    }
  };

  return (
    <RegisterContainer>
      <RegisterHeader>
        <h1>Register</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>} 
      </RegisterHeader>
      <RegisterForm onSubmit={handleRegister}>
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        <Button type="submit">Register</Button>
      </RegisterForm>
      <LoginButton onClick={() => navigate('/login')}>Go to Login</LoginButton>
    </RegisterContainer>
  );
};

export default Register;