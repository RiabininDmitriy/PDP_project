export enum CharacterClass {
    Warrior = 'Warrior',
    Mage = 'Mage',
    Thief = 'Thief'
  }

export interface CharacterClassAttributes {
  health: number;
  attack: number;
  defense: number;
}