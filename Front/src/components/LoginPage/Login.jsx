import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './login.css';
import api from '../../api/api';

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
    <div className="login-container">
      <div className='login-header'>
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>} 
      </div>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => navigate('/register')} className="register-button">Go to Register</button>
    </div>
  );
};

export default Login;