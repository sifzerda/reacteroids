// src/ecs/systems/shipControlSystem.js

import { ships } from '../core/queries';
import { keys, mouse } from '../core/input';
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

    // Cache direction vectors
    const cos = Math.cos(ship.rotation);
    const sin = Math.sin(ship.rotation);

    ship.forwardX = cos;
    ship.forwardY = sin;

    ship.rightX = -sin;
    ship.rightY = cos;

    ship.exhaustTimer ??= 0;
    ship.exhaustTimer -= delta;

    // THRUST
    if (keys['ArrowUp']) {

      ship.vx += ship.forwardX * THRUST * delta;
      ship.vy += ship.forwardY * THRUST * delta;

      if (ship.exhaustTimer <= 0) {
        ship.exhaustTimer = 0.025;

        for (let i = 0; i < 2; i++) {

          spawnExhaust({
            // move spawn point closer — was 0.4
            x: ship.x - ship.forwardX * 0.05,
            y: ship.y - ship.forwardY * 0.05,
            vx: -ship.forwardX * 1.5,
            vy: -ship.forwardY * 1.5,
          });
        }
      }
    }

    // REVERSE THRUST
    if (keys['ArrowDown']) {
      ship.vx -= ship.forwardX * REVERSE_THRUST * delta;
      ship.vy -= ship.forwardY * REVERSE_THRUST * delta;
    }

    // LIMIT REVERSE SPEED
    const forwardVelocity = ship.vx * ship.forwardX + ship.vy * ship.forwardY;

    if (forwardVelocity < -MAX_REVERSE_SPEED) {
      const excess = (-MAX_REVERSE_SPEED - forwardVelocity);

      ship.vx += ship.forwardX * excess;
      ship.vy += ship.forwardY * excess;
    }

    // DRIFT / TRACTION
    const forwardSpeed = ship.vx * ship.forwardX + ship.vy * ship.forwardY;
    const sideSpeed = ship.vx * ship.rightX + ship.vy * ship.rightY;
    const newSideSpeed = sideSpeed * (1 - TRACTION);

    ship.vx = ship.forwardX * forwardSpeed + ship.rightX * newSideSpeed;
    ship.vy = ship.forwardY * forwardSpeed + ship.rightY * newSideSpeed;

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