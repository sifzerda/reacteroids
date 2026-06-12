// src/ecs/defs/enemyDefs.js

export const enemyDefs = {

  drone: {

    hp: 50,
    radius: 0.4,
    speed: 4,
    score: 100,
    color: '#00ffff',
    abilities: ['chase']
  },

  fighter: {

    hp: 100,
    radius: 0.6,
    speed: 5,
    score: 250,
    color: '#ff00ff',
    abilities: ['chase','shoot']
  },

  kamikaze: {

    hp: 30,
    radius: 0.5,
    speed: 10,
    score: 150,
    color: '#ff3300',
    abilities: ['dash','shoot']
  }
};