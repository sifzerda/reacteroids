// src/ecs/systems/shipControlSystem.js

import { ships } from '../core/queries';
import { keys } from '../core/input';
import { forwardVector, rightVector } from '../core/direction';

const THRUST = 28;
const REVERSE_THRUST = 18;

const TURN_ACCEL = 42;
const TURN_DRAG = 0.94;
const MAX_TURN_SPEED = 10;

const DRAG = 0.992;
const TRACTION = 0.03;

const MAX_SPEED = 32;
const MAX_REVERSE_SPEED = 18;

export function shipControlSystem(delta) {

  for (const ship of ships) {

    ship.angularVelocity ??= 0;

    // TURNING
    if (keys['ArrowLeft']) { ship.angularVelocity += TURN_ACCEL * delta }
    if (keys['ArrowRight']) { ship.angularVelocity -= TURN_ACCEL * delta }

    ship.angularVelocity = Math.max(-MAX_TURN_SPEED, Math.min(MAX_TURN_SPEED, ship.angularVelocity));
    ship.rotation += ship.angularVelocity * delta;

    // Rotational damping
    ship.angularVelocity *= TURN_DRAG;

    // Slight auto-stabilization
    if (!keys['ArrowLeft'] && !keys['ArrowRight']) { ship.angularVelocity *= 0.9 }

    // SHIP FORWARD VECTOR
    const forward = forwardVector(ship.rotation);
    // SHIP RIGHT VECTOR
    const right = rightVector(ship.rotation);

    // THRUST
    if (keys['ArrowUp']) {
      ship.vx += forward.x * THRUST * delta;
      ship.vy += forward.y * THRUST * delta;
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

    // Reduce sideways sliding while keeping most momentum
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