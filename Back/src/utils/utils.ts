import { WEIGHTS } from '../modules/characters/config/character-classes.config';

export const calculateGearScore = (characterAttributes) => {
    const { hp, normalAttack, heavyAttack, defense } = characterAttributes;
    return (
      WEIGHTS.hpWeight * hp +
      WEIGHTS.normalAttackWeight * normalAttack +
      WEIGHTS.heavyAttackWeight * heavyAttack +
      WEIGHTS.defenseWeight * defense
    );
  }