// src/ecs/systems/shipSystem.js

import { ships } from '../queries';
import { keys } from '../input';

const TURN_SPEED = 4;
const THRUST = 12;
const DRAG = 0.985;

export function shipSystem(delta) {
  for (const ship of ships) {

    // ROTATION
    if (keys['ArrowLeft']) {
      ship.rotation += TURN_SPEED * delta;
    }

    if (keys['ArrowRight']) {
      ship.rotation -= TURN_SPEED * delta;
    }

    // THRUST
    if (keys['ArrowUp']) {
      ship.vx +=
        Math.cos(ship.rotation) *
        THRUST *
        delta;

      ship.vy +=
        Math.sin(ship.rotation) *
        THRUST *
        delta;
    }

    // DRAG
    ship.vx *= DRAG;
    ship.vy *= DRAG;

    // SCREEN WRAP
    const limit = 9;

    if (ship.x > limit) ship.x = -limit;
    if (ship.x < -limit) ship.x = limit;

    if (ship.y > limit) ship.y = -limit;
    if (ship.y < -limit) ship.y = limit;
  }
}