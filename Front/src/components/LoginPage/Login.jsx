import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styled from 'styled-components';
import api from '../../api/api';

const LoginForm = styled.form`
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

const RegisterButton = styled(Button)`
  margin-top: 20px;
  background-color: #008CBA;

  &:hover {
    background-color: #007BAA;
  }
`;

const LoginContainer = styled.div`
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

const LoginHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
`;

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const token = response.data.access_token;
      const userId = response.data.userId;
      const characterId = response.data.characterId;

      Cookies.set('token', token, { expires: 1 }); 
      Cookies.set('userId', userId, { expires: 1 });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (characterId) {
        navigate(`/character/${userId}`);
      } else {
        navigate('/character-classes');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        console.error('Login failed', error);
      }
    }
  };

  return (
    <LoginContainer>
      <LoginHeader>
        <h1>Login</h1>
        {error && <ErrorMessage>{error}</ErrorMessage>} 
      </LoginHeader>
      <LoginForm onSubmit={handleLogin}>
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
        <Button type="submit">Login</Button>
      </LoginForm>
      <RegisterButton onClick={() => navigate('/register')}>Go to Register</RegisterButton>
    </LoginContainer>
  );
};

export default Login;