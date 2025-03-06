export const CHARACTER_CLASSES = {
    Warrior: {
      hp: 200,
      normalAttack: 15,
      heavyAttack: 30,
      defense: 20,
      money: 100,
      imageUrl: 'https://www.pngfind.com/pngs/m/266-2666314_dota-2-characters-png-sven-dota-2-immortal.png',
    },
    Mage: {
      hp: 120,
      normalAttack: 25,
      heavyAttack: 40,
      defense: 10,
      money: 100,
      imageUrl: 'https://e7.pngegg.com/pngimages/418/613/png-clipart-dota-2-combo-steam-desktop-others-miscellaneous-fictional-character.png',
    },
    Thief: {
      hp: 150,
      normalAttack: 20,
      heavyAttack: 35,
      defense: 15,
      money: 100,
      imageUrl: 'https://w7.pngwing.com/pngs/118/778/png-transparent-dota-2-juggernaut-illustration-dota-2-juggernaut-electronic-sports-desktop-dota-miscellaneous-computer-fictional-character.png',
    },
  };

  export const WEIGHTS = {
    hpWeight: 1,              // Health points (HP) weight
    normalAttackWeight: 2,     // Normal attack power weight
    heavyAttackWeight: 2,      // Heavy attack power weight
    defenseWeight: 1.5,        // Defense power weight
  };