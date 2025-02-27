import styled from "styled-components";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
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
    width: 20%;
    font-size: 16px;
  }
`;

const BattleInfo = () => {
  const userId = Cookies.get('userId');
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/character/${userId}`);
  };

  const getAllBattles = async () => {
    const response = await api.get(`/battle-logs/user/${userId}`);
   
    console.log(response);
  };

  useEffect(() => {
    getAllBattles();
  }, []);

  return (
    <BattleInfoContainer>
      <h1>Battle Info</h1>
      <button className="back-button" onClick={handleBack}>return to character</button>
    </BattleInfoContainer>
  );
};

export default BattleInfo;
