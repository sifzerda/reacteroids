// src/ecs/systems/shipControlSystem.js

import { ships } from '../core/queries';
import { keys, mouse } from '../core/input';
import { forwardVector, rightVector } from '../core/direction';
import { settings } from '../core/settings';
import { spawnExhaust } from '../spawn';

const THRUST = 30;
const REVERSE_THRUST = 20;
const TURN_ACCEL = 90;
const TURN_DRAG = 0.96;
const MAX_TURN_SPEED = 16;
const DRAG = 0.998;
const TRACTION = 0.025;
const MAX_SPEED = 32;
const MAX_REVERSE_SPEED = 20;

export function shipControlSystem(delta) {

  for (const ship of ships) {

    ship.angularVelocity ??= 0;

    // TURNING
    if (settings.controlScheme === 'keyboardMouse') {

      const dx = mouse.worldX - ship.x;
      const dy = mouse.worldY - ship.y;

      ship.rotation = Math.atan2(dy, dx);
      ship.angularVelocity = 0;

    } else {

      if (keys['ArrowLeft']) {
        ship.angularVelocity += TURN_ACCEL * delta;
      }

      if (keys['ArrowRight']) {
        ship.angularVelocity -= TURN_ACCEL * delta;
      }

      ship.angularVelocity = Math.max(-MAX_TURN_SPEED, Math.min(MAX_TURN_SPEED, ship.angularVelocity));
      ship.rotation += ship.angularVelocity * delta;
      ship.angularVelocity *= TURN_DRAG;

      if (!keys['ArrowLeft'] && !keys['ArrowRight']) {
        ship.angularVelocity *= 0.9;
      }
    }

    // SHIP FORWARD VECTOR
    const forward = forwardVector(ship.rotation);
    // SHIP RIGHT VECTOR
    const right = rightVector(ship.rotation);

    ship.exhaustTimer ??= 0;
    ship.exhaustTimer -= delta;

    // THRUST
    if (keys['ArrowUp']) {

      ship.vx += forward.x * THRUST * delta;
      ship.vy += forward.y * THRUST * delta;

      if (ship.exhaustTimer <= 0) {
        ship.exhaustTimer = 0.025;

        for (let i = 0; i < 2; i++) {

          spawnExhaust({
            // move spawn point closer — was 0.4
            x: ship.x - forward.x * 0.05,
            y: ship.y - forward.y * 0.05,
            vx: -forward.x * 1.5,
            vy: -forward.y * 1.5,
          });
        }
      }
    }

    // REVERSE THRUST
    if (keys['ArrowDown']) {
      ship.vx -= forward.x * REVERSE_THRUST * delta;
      ship.vy -= forward.y * REVERSE_THRUST * delta;
    }

    // LIMIT REVERSE SPEED
    const forwardVelocity = ship.vx * forward.x + ship.vy * forward.y;

    if (forwardVelocity < -MAX_REVERSE_SPEED) {
      const excess = (-MAX_REVERSE_SPEED - forwardVelocity);

      ship.vx += forward.x * excess;
      ship.vy += forward.y * excess;
    }

    // DRIFT / TRACTION
    const forwardSpeed = ship.vx * forward.x + ship.vy * forward.y;
    const sideSpeed = ship.vx * right.x + ship.vy * right.y;
    const newSideSpeed = sideSpeed * (1 - TRACTION);

    ship.vx = forward.x * forwardSpeed + right.x * newSideSpeed;
    ship.vy = forward.y * forwardSpeed + right.y * newSideSpeed;

    // EXTRA TURN DRIFT
    const speed = Math.hypot(ship.vx, ship.vy);
    if (speed > 0.5) {
      const driftStrength = 0.15;
      ship.vx += Math.sin(ship.rotation) * ship.angularVelocity * driftStrength * delta * speed;
      ship.vy -= Math.cos(ship.rotation) * ship.angularVelocity * driftStrength * delta * speed;
    }

    // LINEAR DRAG
    ship.vx *= DRAG;
    ship.vy *= DRAG;

    // FORWARD SPEED LIMIT
    const currentSpeed = Math.hypot(ship.vx, ship.vy);

    if (currentSpeed > MAX_SPEED) {
      const scale = MAX_SPEED / currentSpeed;
      ship.vx *= scale;
      ship.vy *= scale;
    }
  }
}