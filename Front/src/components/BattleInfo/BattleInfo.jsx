import styled from "styled-components";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import BattleComponent from "./BattleComponent";
const BattleInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .back-button {
    background-color: blue;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    font-size: 16px;
    margin-bottom: 20px;
  }

  .battle-info-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const BattleInfo = () => {
  const userId = Cookies.get('userId');
  const navigate = useNavigate();
  const [battles, setBattles] = useState([]);

  const handleBack = () => {
    navigate(`/character/${userId}`);
  };

  const getAllBattles = async () => {
    const response = await api.get(`/battle-logs/users/${userId}`);
    setBattles(response.data);
    console.log(response);
  };

  useEffect(() => {
    getAllBattles();
  }, []);

  return (
    <BattleInfoContainer>
      <div className="battle-info-container">
        <h1>Battle Info</h1>
        <button className="back-button" onClick={handleBack}>return to character</button>
      </div>

      {battles.length > 0 && battles.map((battle) => (
        <BattleComponent key={battle.id} battleData={battle} />
      ))}
    </BattleInfoContainer>
  );
};

export default BattleInfo;
