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
  height: 100vh;
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
    const res = await api.post(
      `/battle/users/${userId}/characters/${character.id}/battle/${battleData.data.id}/round/`
    );

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

      <button onClick={handleGetOpponent}>Get Opponent</button>
      {opponent.status === "found" && (
        <p>Opponent: {opponent.opponent.user.username}</p>
      )}
      {opponent.status === "found" && (
        <p>Opponent GearScore: {opponent.opponent.gearScore}</p>
      )}
      {opponent.status === "found" && (
        <button onClick={handleStartBattle}>Start Battle</button>
      )}
      <button
        style={{ marginTop: "40px", backgroundColor: "red" }}
        onClick={handleLogOut}
      >
        Log Out
      </button>
    </Container>
  );
};

export default UserCharacter;
