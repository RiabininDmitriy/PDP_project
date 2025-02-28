import React, { useState } from "react";
import styled from "styled-components";
const BattleComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 10px;
  margin: 10px;
  width: 90%;
  cursor: pointer;
  .battle-table {
    width: 100%;
    border-collapse: collapse;
  }

  .battle-table-header {
    background-color: #f2f2f2;
    text-align: left;
  }

  .battle-table-header-cell {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .battle-table-cell {
    border: 1px solid #ddd;
    padding: 8px;
  }

  .battle-info {
    cursor: pointer;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
`;

const BattleComponent = ({ battleData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  return (
    <BattleComponentContainer onClick={toggleDetails}>
      <div className="battle-info">
        {battleData[0].defenderName} VS {battleData[0].attackerName}
      </div>
      {isOpen && (
        <div>
          <h3>Деталі бою:</h3>
          <table onClick={toggleDetails} className="battle-table">
            <thead>
              <tr className="battle-table-header">
                <th className="battle-table-header-cell">Раунд</th>
                <th className="battle-table-header-cell">Атакував</th>
                <th className="battle-table-header-cell">Захищався</th>
                <th className="battle-table-header-cell">Завдано урону</th>
                <th className="battle-table-header-cell">Здоров'я атакувальника</th>
                <th className="battle-table-header-cell">Здоров'я захищаючого</th>
              </tr>
            </thead>
            <tbody>
              {battleData.map((battle, index) => (
                <tr key={index}>
                  <td className="battle-table-cell">{battle.round}</td>
                  <td className="battle-table-cell">{battle.attackerName}</td>
                  <td className="battle-table-cell">{battle.defenderName}</td>
                  <td className="battle-table-cell">{battle.damage}</td>
                  <td className="battle-table-cell">{battle.attackerHp}</td>
                  <td className="battle-table-cell">{battle.defenderHp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Переможець: {battleData[0].battle.winnerName}</p>
        </div>
      )}
    </BattleComponentContainer>
  );
};

export default BattleComponent;
