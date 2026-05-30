// src/ecs/systems/shipControlSystem.js

import { ships } from '../queries';
import { keys } from '../input';

const THRUST = 28;

const TURN_ACCEL = 42;
const TURN_DRAG = 0.94;
const MAX_TURN_SPEED = 10;

const DRAG = 0.992;
const TRACTION = 0.03;
const MAX_SPEED = 32;

export function shipControlSystem(delta) {

  for (const ship of ships) {

    ship.angularVelocity ??= 0;

    //
    // TURNING
    //

    if (keys['ArrowLeft']) {
      ship.angularVelocity += TURN_ACCEL * delta;
    }

    if (keys['ArrowRight']) {
      ship.angularVelocity -= TURN_ACCEL * delta;
    }

    ship.angularVelocity = Math.max(
      -MAX_TURN_SPEED,
      Math.min(MAX_TURN_SPEED, ship.angularVelocity)
    );

    ship.rotation += ship.angularVelocity * delta;

    // rotational damping
    ship.angularVelocity *= TURN_DRAG;

    // slight stabilization
    if (
      !keys['ArrowLeft'] &&
      !keys['ArrowRight']
    ) {
      ship.angularVelocity *= 0.9;
    }

    //
    // THRUST
    //

    if (keys['ArrowUp']) {

      const forwardX = Math.cos(ship.rotation);
      const forwardY = Math.sin(ship.rotation);

      ship.vx += forwardX * THRUST * delta;
      ship.vy += forwardY * THRUST * delta;
    }

    //
    // DRIFT / TRACTION
    //

    const forwardX = Math.cos(ship.rotation);
    const forwardY = Math.sin(ship.rotation);

    // velocity components relative to ship facing
    const forwardSpeed =
      ship.vx * forwardX +
      ship.vy * forwardY;

    const sideSpeed =
      ship.vx * -forwardY +
      ship.vy * forwardX;

    // keep most forward momentum
    const newSideSpeed =
      sideSpeed * (1 - TRACTION);

    ship.vx =
      forwardX * forwardSpeed +
      (-forwardY) * newSideSpeed;

    ship.vy =
      forwardY * forwardSpeed +
      forwardX * newSideSpeed;

    //
    // EXTRA TURN DRIFT
    //
    // Makes the rear swing outward while cornering.
    //

    const speed = Math.hypot(ship.vx, ship.vy);

    if (speed > 0.5) {

      const driftStrength = 0.15;

      ship.vx +=
        Math.sin(ship.rotation) *
        ship.angularVelocity *
        driftStrength *
        delta *
        speed;

      ship.vy -=
        Math.cos(ship.rotation) *
        ship.angularVelocity *
        driftStrength *
        delta *
        speed;
    }

    //
    // LINEAR DRAG
    //

    ship.vx *= DRAG;
    ship.vy *= DRAG;

    //
    // SPEED LIMIT
    //

    const currentSpeed =
      Math.hypot(ship.vx, ship.vy);

    if (currentSpeed > MAX_SPEED) {

      const scale =
        MAX_SPEED / currentSpeed;

      ship.vx *= scale;
      ship.vy *= scale;
    }
  }
}