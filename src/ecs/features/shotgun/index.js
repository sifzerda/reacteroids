// src/ecs/features/shotgun/index.js

import { shotgunWeapon } from './shotgunWeapon';

export default {

  id: 'shotgun',
  hotkey: 'Digit2',
  weapon: shotgunWeapon,

  cooldown: shotgunWeapon.cooldown,

  fire(ship) {
    shotgunWeapon.fire(ship);
  },

};