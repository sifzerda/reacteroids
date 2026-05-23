// src/ecs/gameState.js

export const gameState = {

  score: 0,
  combo: 1,

  wave: 1,
  difficulty: 1,

  lives: 3,

  // wave tracking

  waveAsteroidsTotal: 8,
  waveAsteroidsRemaining: 8,

  // bomb meter

  bombCharge: 0,
  bombChargeRequired: 100,

  bombReady: false,
};