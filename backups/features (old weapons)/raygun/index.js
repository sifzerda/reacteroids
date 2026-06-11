// src/ecs/features/raygun/index.js

import { raygunWeapon } from './raygunWeapon';

export default {

  id: 'raygun',
  hotkey: 'Digit1',
  weapon: raygunWeapon,

  cooldown: raygunWeapon.cooldown,

  fire(ship) {
    raygunWeapon.fire(ship);
  },

};