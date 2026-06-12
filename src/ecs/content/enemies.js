// ecs/content/enemies.js

export const enemies = {

  drone: {

    hp: 100,

    radius: 0.5,

    speed: 3,

    update(enemy, ship, delta) {

      const dx = ship.x - enemy.x;
      const dy = ship.y - enemy.y;

      const dist =
        Math.hypot(dx, dy) || 1;

      enemy.vx =
        dx / dist * enemy.speed;

      enemy.vy =
        dy / dist * enemy.speed;
    }
  },

  kamikaze: {

    hp: 50,

    radius: 0.4,

    speed: 7,

    update(enemy, ship) {

      const dx = ship.x - enemy.x;
      const dy = ship.y - enemy.y;

      const dist =
        Math.hypot(dx, dy) || 1;

      enemy.vx =
        dx / dist * enemy.speed;

      enemy.vy =
        dy / dist * enemy.speed;
    }
  },

// adding a new enemy copy paste:

//sniper: {
//  hp:80,
//  radius:0.4,
//  speed:1.5,
 // update(enemy, ship){
//    const dx = ship.x - enemy.x;
//    const dy = ship.y - enemy.y;
//    const dist = Math.hypot(dx,dy);
//    if(dist > 6){
//     enemy.vx = dx/dist * enemy.speed;
//      enemy.vy = dy/dist * enemy.speed;
//    }
//  }
//},

};