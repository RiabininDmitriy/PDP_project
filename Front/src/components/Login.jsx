import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Cookies from 'js-cookie';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
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

      Cookies.set('token', token, { expires: 1 }); 

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/users');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')}>Go to Register</button>
    </div>
  );
};

export default Login;