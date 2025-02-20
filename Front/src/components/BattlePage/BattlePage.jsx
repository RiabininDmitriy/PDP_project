import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Cookies from "js-cookie";

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

  const restartBattle = () => {
    navigate(`/character/${userId}`);
  };

  useEffect(() => {
    startBattle();
  }, [battleId]);

  return (
    <div>
      {searching ? (
        <p>Searching for opponent...</p>
      ) : battleFinished ? (
        <div>
          <h2>Battle Finished</h2>
          <div>
            <h3>Winner: {winner.user.username}</h3>
            <img
              style={{ width: "100px", height: "100px" }}
              src={winner.imageUrl}
              alt="Winner"
            />
            <p>Class: {winner.classType}</p>
            <p>HP: {winner.hp}</p>
            <p>Gear Score: {winner.gearScore}</p>
            <p>Level: {winner.level}</p>
            <p>XP: {winner.xp}</p>
            <p>Normal Attack: {winner.normalAttack}</p>
            <p>Heavy Attack: {winner.heavyAttack}</p>
            <p>Defense: {winner.defense}</p>
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
