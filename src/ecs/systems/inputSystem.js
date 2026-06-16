// src/ecs/systems/inputSystem.js

import { input } from '../core/input';

export function inputSystem() {
  input.firePressed = false;
  input.fireReleased = false;
}