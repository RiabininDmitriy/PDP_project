import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import api from '../../api/api';
import styled from 'styled-components';

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

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await api.get(`/characters/${userId}`);
        setCharacter(response.data);
      } catch (error) {
        console.error('Error fetching character', error);
      }
    };
    fetchCharacter();
  }, [userId]); 

  if (!character) {
    return <div>Loading...</div>;
  }

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
    </Container>
  );
};

export default UserCharacter;