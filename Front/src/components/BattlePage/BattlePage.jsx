import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Cookies from "js-cookie";

const BattlePage = () => {
  const [searching, setSearching] = useState(false);
  const [battleData, setBattleData] = useState(null);
  const [battleFinished, setBattleFinished] = useState(false); // Track if the battle is finished
  const [playerStats, setPlayerStats] = useState(null); // Store player stats after battle
  const userId = Cookies.get("userId");
  const battleId = Cookies.get("battleId");
  const navigate = useNavigate();
  
  const startBattle = async () => {
    try {
      const response = await api.get(`/battle/users/${userId}/characters/${battleId}/battle/${battleId}/status`);;
      const data = response.data; // Axios puts response data in the `data` field.

      if (data.status === "searching") {
        setSearching(true);
      } else if (data.status === "in_progress") {
        startPollingBattle(data.battleId);
      }
    } catch (error) {
      console.error("Error starting battle:", error);
    }
  };

  const startPollingBattle = (id) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.post(`/battle/users/${userId}/characters/${battleId}/battle/${battleId}/round`);
        const status = await api.get(`/battle/users/${userId}/characters/${battleId}/battle/${battleId}/status`);

        const data = response.data;
        setBattleData(data);

        if (status.data.status === "finished") {
          clearInterval(interval);
          setBattleFinished(true);
          setPlayerStats(
            data.winnerId === data.playerOne.id
              ? data.playerOne
              : data.playerTwo
          ); // Set stats of the winner
          console.log("Battle finished, winner:", data.winnerId);
        }
      } catch (error) {
        console.error("Error polling battle status:", error);
      }
    }, 2000); // Increased interval to 2 seconds
  };

  const restartBattle = () => {
    navigate(`/character/${userId}`);
  };

  useEffect(() => {
    if (battleId) {
      startBattle();
    }
  }, [battleId]);

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
              <h3>Player 1: {battleData.playerOne.user.username}</h3>
              <img
                style={{ width: "100px", height: "100px" }}
                src={battleData.playerOne.imageUrl}
                alt="Player 1"
              />
              <p>Class: {battleData.playerOne.classType}</p>
              <p>
                HP: {battleData.playerOneHp} / {battleData.playerOne.hp}
              </p>
              <p>Gear Score: {battleData.playerOne.gearScore}</p>
              <p>Level: {battleData.playerOne.level}</p>
              <p>Normal Attack: {battleData.playerOne.normalAttack}</p>
              <p>Heavy Attack: {battleData.playerOne.heavyAttack}</p>
              <p>Defense: {battleData.playerOne.defense}</p>
            </div>
            <div>
              <h3>Player 2: {battleData.playerTwo.user.username}</h3>
              <img
                style={{ width: "100px", height: "100px" }}
                src={battleData.playerTwo.imageUrl}
                alt="Player 2"
              />
              <p>Class: {battleData.playerTwo.classType}</p>
              <p>
                HP: {battleData.playerTwoHp} / {battleData.playerTwo.hp}
              </p>
              <p>Gear Score: {battleData.playerTwo.gearScore}</p>
              <p>Level: {battleData.playerTwo.level}</p>
              <p>Normal Attack: {battleData.playerTwo.normalAttack}</p>
              <p>Heavy Attack: {battleData.playerTwo.heavyAttack}</p>
              <p>Defense: {battleData.playerTwo.defense}</p>
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
