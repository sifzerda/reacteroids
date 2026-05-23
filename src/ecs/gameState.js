// src/ecs/gameState.js

export const gameState = {

  score: 0,
  combo: 1,

  wave: 1,
  difficulty: 1,

  lives: 3,

  // WAVE PROGRESS

  waveProgress: 0,

  // total progress required
  // to complete current wave

  waveProgressRequired: 24,

  // bomb meter

  bombCharge: 0,
  bombChargeRequired: 100,

  bombReady: false,
};