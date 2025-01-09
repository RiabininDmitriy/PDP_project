import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
import api from '../../api/api';
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
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        console.error('Registration failed', error);
      }
    }
  };

  return (
    <div className="register-container">
      <div className='register-header'>
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>} 
      </div>
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

      <button className="login-button" onClick={() => navigate('/login')}>Go to Login</button>
    </div>
  );
};

export default Register;