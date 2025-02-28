import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Cookies from "js-cookie";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .back-to-character-button {
    background-color: #4caf50;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    width: 100%;
  }

  .battle-finished-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .battle-in-progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .battle-log-container {
    flex: 1 0 30%;
    margin: 5px;
    padding: 10px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .winner-image {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }

  .battle-in-progress-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .player-image {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }

  .battle-in-progress {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
  }
`;

const BattlePage = () => {
  const [searching, setSearching] = useState(false);
  const [battleData, setBattleData] = useState(null);
  const [battleFinished, setBattleFinished] = useState(false);
  const [playerStats, setPlayerStats] = useState(null);
  const [ownerHp, setOwnerHp] = useState(0);
  const [opponentHp, setOpponentHp] = useState(0);
  const userId = Cookies.get("userId");
  const battleId = Cookies.get("battleId");
  const characterId = Cookies.get("characterId");
  const navigate = useNavigate();
  const [rounds, setRounds] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [intervalId, setIntervalId] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    setIntervalId(
      setInterval(() => {
        if (currentRound <= rounds) {
          fetchRoundDetails(currentRound);
          setCurrentRound(currentRound + 1);
        } else {
          clearInterval(intervalId);
        }
      }, 1000)
    );

    return () => clearInterval(intervalId);
  }, [currentRound, rounds]);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, []);

  const fetchRoundDetails = async (round) => {
    try {
      const response = await api.get(
        `/battle/users/${userId}/characters/${characterId}/battle/${battleId}/round/${round}/status`
      );
      setBattleData(response.data);
      setOwnerHp(response.data.roundLog.attackerHp);
      setOpponentHp(response.data.roundLog.defenderHp);
      if (response.data.status === "finished") {
        setBattleFinished(true);
        clearInterval(intervalId);
      }
      if (response.data.status === "error") {
        clearInterval(intervalId);
      }
    } catch (error) {
      clearInterval(intervalId);
      console.error("Error fetching round details:", error);
    }
  };

  const startBattle = async () => {
    try {
      const res = await api.post(
        `/battle/users/${userId}/characters/${characterId}/battle/${battleId}/round/`
      );
      setRounds(res.data.rounds);
      setPlayerStats(res.data.battle);
      const winner =
        res.data.battle.winnerId === res.data.battle.playerOne.id
          ? res.data.battle.playerOne
          : res.data.battle.playerTwo;

      setWinner(winner);
      setSearching(false);
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  const backToCharacter = () => {
    clearInterval(intervalId);
    navigate(`/character/${userId}`);
  };

  useEffect(() => {
    startBattle();
  }, [battleId]);

  return (
    <Container>
      {searching ? (
        <p>Searching for opponent...</p>
      ) : battleFinished ? (
        <div className="battle-finished-container">
          <h2>Battle Finished</h2>
          <div>
            <h3>Winner: {winner.user.username}</h3>
            <img className="winner-image" src={winner.imageUrl} alt="Winner" />
            <p>Class: {winner.classType}</p>
            <p>HP: {winner.hp}</p>
            <p>Gear Score: {winner.gearScore}</p>
            <p>Level: {winner.level}</p>
            <p>XP: {winner.xp}</p>
            <p>Normal Attack: {winner.normalAttack}</p>
            <p>Heavy Attack: {winner.heavyAttack}</p>
            <p>Defense: {winner.defense}</p>
          </div>
          <button className="back-to-character-button" onClick={backToCharacter}>
            Back to Character
          </button>
        </div>
      ) : battleData ? (
        <div className="battle-in-progress-container">
          <h2>Battle in Progress</h2>
          <div className="battle-in-progress">
            <div>
              <h3>Player 1: {playerStats.playerOne.user.username}</h3>
              <img
                className="player-image"
                src={playerStats.playerOne.imageUrl}
                alt="Player 1"
              />
              <p>Class: {playerStats.playerOne.classType}</p>
              <p>
                HP: {ownerHp} / {playerStats.playerOne.hp}
              </p>
              <p>Gear Score: {playerStats.playerOne.gearScore}</p>
              <p>Level: {playerStats.playerOne.level}</p>
              <p>Normal Attack: {playerStats.playerOne.normalAttack}</p>
              <p>Heavy Attack: {playerStats.playerOne.heavyAttack}</p>
              <p>Defense: {playerStats.playerOne.defense}</p>
            </div>
            <div>
              <h3>Player 2: {playerStats.playerTwo.user.username}</h3>
              <img
                className="player-image"
                src={playerStats.playerTwo.imageUrl}
                alt="Player 2"
              />
              <p>Class: {playerStats.playerTwo.classType}</p>
              <p>
                HP: {opponentHp} / {playerStats.playerTwo.hp}
              </p>
              <p>Gear Score: {playerStats.playerTwo.gearScore}</p>
              <p>Level: {playerStats.playerTwo.level}</p>
              <p>Normal Attack: {playerStats.playerTwo.normalAttack}</p>
              <p>Heavy Attack: {playerStats.playerTwo.heavyAttack}</p>
              <p>Defense: {playerStats.playerTwo.defense}</p>
            </div>
          </div>

          <div className="battle-log-container">
            Раунд: {battleData.round}
            <p>
              {battleData.roundLog.attackerName} вдарив{" "}
              {battleData.roundLog.defenderName}
            </p>
            <p>Завдано урону: {battleData.roundLog.damage}</p>
            <p>
              Здоров'я {battleData.roundLog.attackerName}:{" "}
              {battleData.roundLog.attackerHp}
            </p>
            <p>
              Здоров'я {battleData.roundLog.defenderName}:{" "}
              {battleData.roundLog.defenderHp}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading battle details...</p>
      )}
    </Container>
  );
};

export default BattlePage;
