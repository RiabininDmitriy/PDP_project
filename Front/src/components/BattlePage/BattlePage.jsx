import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Cookies from "js-cookie";

const BattlePage = () => {
  const [searching, setSearching] = useState(false);
  const [battleData, setBattleData] = useState(null);
  const [battleFinished, setBattleFinished] = useState(false); // Track if the battle is finished
  const [playerStats, setPlayerStats] = useState(null); // Store player stats after battle
  const [ownerHp, setOwnerHp] = useState(0);
  const [opponentHp, setOpponentHp] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [battleLogs, setBattleLogs] = useState([]);  

  const userId = Cookies.get("userId");
  const battleId = Cookies.get("battleId");
  const characterId = Cookies.get("characterId");
  const navigate = useNavigate();

  const startBattle = async () => {
    try {
      const res = await api.post(
        `/battle/users/${userId}/characters/${characterId}/battle/${battleId}/round/`
      );

      const response = await api.get(
        `/battle/users/${userId}/characters/${characterId}/battle/${battleId}/round/status`
      );
      setPlayerStats(res.data);
      setSearching(false);
      setBattleData(response.data);
      setBattleLogs(response.data.battle.logs);
      setCurrentRound(response.data.currentRound);
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  const restartBattle = () => {
    navigate(`/character/${userId}`);
  };

  useEffect(() => {
    startBattle();
  }, [battleId]);

  useEffect(() => {
    if (battleData) {
      setOwnerHp(playerStats.playerOne.hp);
      setOpponentHp(playerStats.playerTwo.hp);
    }
  }, [battleData]);

  return (
    <div>
      {searching ? (
        <p>Searching for opponent...</p>
      ) : battleFinished ? (
        <div>
          <h2>Battle Finished</h2>
          <div>
            <h3>Winner: {playerStats.user.username}</h3>
            <img
              style={{ width: "100px", height: "100px" }}
              src={playerStats.imageUrl}
              alt="Winner"
            />
            <p>Class: {playerStats.classType}</p>
            <p>HP: {playerStats.hp}</p>
            <p>Gear Score: {playerStats.gearScore}</p>
            <p>Level: {playerStats.level}</p>
            <p>XP: {playerStats.xp}</p>
            <p>Normal Attack: {playerStats.normalAttack}</p>
            <p>Heavy Attack: {playerStats.heavyAttack}</p>
            <p>Defense: {playerStats.defense}</p>
          </div>
          <button onClick={restartBattle}>Back to Character</button>
        </div>
      ) : battleData ? (
        <div>
          <h2>Battle in Progress</h2>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <h3>Player 1: {playerStats.playerOne.user.username}</h3>
              <img
                style={{ width: "100px", height: "100px" }}
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
                style={{ width: "100px", height: "100px" }}
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
        </div>
      ) : (
        <p>Loading battle details...</p>
      )}
    </div>
  );
};

export default BattlePage;
