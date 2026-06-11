//src/ecs/defs/weaponDefs.js

export const weaponDefs = {

    raygun: {

        hotkey: 'Digit1',

        cooldown: 0.20,

        abilities: [
            'singleShot'
        ]
    },

    shotgun: {

        hotkey: 'Digit2',

        cooldown: 0.70,

        abilities: [
            'spreadShot'
        ]
    },

    machinegun: {

        hotkey: 'Digit3',

        cooldown: 0.05,

        abilities: [
            'rapidShot'
        ]
    },

    laser: {

        hotkey: 'Digit4',

        cooldown: 0,

        abilities: [
            'laserBeam'
        ]
    },

    plasma: {

        hotkey: 'Digit5',

        cooldown: 0.15,

        abilities: [
            'rainbowShot'
        ]
    },

    missile: {

        hotkey: 'Digit6',

        cooldown: 0.8,

        abilities: [
            'missileShot'
        ]
    },

  //    flamethrower = {
   //       hotkey: 'Digit7',
  //        cooldown: 0.3,
   //       abilities: ['flameBurst']
  //    },

 //   chargeBeam = {
 //       hotkey: 'Digit8',
  //      cooldown: 0,
  //      abilities: ['chargeBeam']
  //  },

   // plasmaGun(ship, delta){


 //   cooldown:0.15,

  //  abilities:[

  //    'rainbowShot',
  //    'piercing',
  //    'explosive'
  //  ]
  
//},

 //   plasmaGun(ship) = {
 //       hotkey: 'Digit9',
  //      cooldown: 0.15,
  //        abilities:['rainbowShot', 'piercing', 'explosive']
  //  },

};