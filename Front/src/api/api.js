import axios from 'axios';
import Cookies from 'js-cookie'; 

const API_URL = 'http://localhost:3001'; 

const token = Cookies.get('token'); 

const api = axios.create({
  baseURL: API_URL,
  
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

export default api;