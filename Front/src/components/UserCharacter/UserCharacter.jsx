import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import styled from "styled-components";
import Cookies from "js-cookie";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .get-opponent-button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 20px;
    width: 50%;
  }

  .log-out-button {
    background-color: red;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 20px;
    width: 20%;
  }

  .battle-info-button {
    background-color: yellow;
    border: none;
    color: black;
    padding: 15px 32px;
    text-align: center;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 20px;
    width: 35%;
  }

  .start-battle-button {
    background-color: blue;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 20px;
    width: 80%;
  }
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
`;

const UserCharacter = () => {
  const { userId } = useParams();
  const [character, setCharacter] = useState(null);
  const [opponent, setOpponent] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await api.get(`/characters/${userId}`);
        setCharacter(response.data);
      } catch (error) {
        console.error("Error fetching character", error);
      }
    };
    fetchCharacter();
  }, [userId]);

  if (!character) {
    return <div>Loading...</div>;
  }

  const handleLogOut = () => {
    Cookies.remove("userId");
    Cookies.remove("token");
    Cookies.remove("user");
    navigate("/");
  };

  const handleStartBattle = async () => {
    const opponentId = opponent.opponent.id;
    const battleData = await api.get(
      `/battle/users/${userId}/opponent/${opponentId}/getBattleId`
    );
    Cookies.set("battleId", battleData.data.id);
    Cookies.set("characterId", character.id);

    navigate(`/battle/${battleData.data.id}`);
  };

  const handleGetOpponent = async () => {
    try {
      const response = await api.get(
        `/characters/${character.id}/users/${userId}/opponent`
      );
      setOpponent(response.data);
    } catch (error) {
      console.error("Error getting opponent", error);
    }
  };

  return (
    <Container>
      <h1>{character.classType} Character</h1>
      <p>HP: {character.hp}</p>
      <Image src={character.imageUrl} alt={character.classType} />
      <p>Normal Attack: {character.normalAttack}</p>
      <p>Heavy Attack: {character.heavyAttack}</p>
      <p>Defense: {character.defense}</p>
      <p>Money: {character.money}</p>
      <p>Level: {character.level}</p>
      <p>GearScore: {character.gearScore}</p>

      <button className="get-opponent-button" onClick={handleGetOpponent}>Get Opponent</button>
      {opponent.status === "found" && (
        <p>Opponent: {opponent.opponent.user.username}</p>
      )}
      {opponent.status === "found" && (
        <p>Opponent GearScore: {opponent.opponent.gearScore}</p>
      )}
      {opponent.status === "found" && (
        <button className="start-battle-button" onClick={handleStartBattle}>Start Battle</button>
      )}
      <button className="battle-info-button" onClick={() => navigate(`/character/${userId}/battle-info`)}>Battle Info</button>
      <button
        className="log-out-button"
        onClick={handleLogOut}
      >
        Log Out
      </button>
    </Container>
  );
};

export default UserCharacter;
