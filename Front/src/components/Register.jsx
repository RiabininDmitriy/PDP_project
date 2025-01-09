import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './register.css';
const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <h1>Register</h1>
      <form onSubmit={handleRegister} className="register-form">
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
        <button type="submit">Register</button>
      </form>
      <button onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default Register;