import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import styled from 'styled-components'; 
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const H1 = styled.h1`
  color: #333;
  font-size: 24px;
  text-align: center;
`;

const ListItem = styled.li`
  background-color: #f0f0f0;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  list-style-type: none;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 30%;
  height: 100px;
`;

const List = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const CharacterClassList = () => {
  const navigate = useNavigate();
  const [characterClasses, setCharacterClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchCharacterClasses = async () => {
      try {
        setTimeout(async () => {
          const response = await api.get('/characters/classes');
          setCharacterClasses(response.data);
        }, 200);
      } catch (error) {
        console.error('Error fetching character classes', error);
      }
    };
    fetchCharacterClasses();
  }, []);

  const handleSelectClass = async (classType) => {
    setSelectedClass(classType);
    try {
      const userId = Cookies.get('userId');
      await api.post(`/characters/${userId}`, { classType });
      navigate(`/character/${userId}`);
    } catch (error) {
      console.error('Error creating character', error);
    }
  };

  return (
    <div>
      <H1>Choose Your Character Class</H1>
      <List>
        {characterClasses.map(({ classType, attributes }) => (
          <ListItem key={classType} onClick={() => handleSelectClass(classType)}>
            <h2>{classType}</h2>
            <Image src={attributes.imageUrl} alt={classType} />
            <p>HP: {attributes.hp}</p>
            <p>Normal Attack: {attributes.normalAttack}</p>
            <p>Heavy Attack: {attributes.heavyAttack}</p>
            <p>Defense: {attributes.defense}</p>
            <p>Money: {attributes.money}</p>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CharacterClassList;