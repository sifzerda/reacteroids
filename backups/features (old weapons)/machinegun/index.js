// src/ecs/features/machinegun/index.js

import { machinegunWeapon } from './machinegunWeapon';

export default {

    id: 'machinegun',
    hotkey: 'Digit3',
    weapon: machinegunWeapon,
    cooldown: machinegunWeapon.cooldown,

  fire(ship) {
    machinegunWeapon.fire(ship);
  },

};