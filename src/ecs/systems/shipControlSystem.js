import { ships } from '../queries';
import { keys } from '../input';

const TURN_SPEED = 4;
const THRUST = 12;
const DRAG = 0.985;

export function shipControlSystem(delta) {

  for (const ship of ships) {

    if (keys['ArrowLeft']) {
      ship.rotation +=
        TURN_SPEED * delta;
    }

    if (keys['ArrowRight']) {
      ship.rotation -=
        TURN_SPEED * delta;
    }

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

    ship.vx *= DRAG;
    ship.vy *= DRAG;
  }
}