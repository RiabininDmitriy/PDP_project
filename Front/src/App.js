import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginPage/Login';
import Register from './components/RegisterPage/Register';
import CharacterClassList from './components/CharacterClassList/CharacterClassList';
import UserCharacter from './components/UserCharacter/UserCharacter';
import BattlePage from './components/BattlePage/BattlePage'; // Import the BattlePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/character-classes" element={<CharacterClassList />} />
        <Route path="/character/:userId" element={<UserCharacter />} />
        <Route path="/battle/:battleId" element={<BattlePage />} />
      </Routes>
    </Router>
  );
}

export default App;