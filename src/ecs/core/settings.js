// src/ecs/core/settings.js

export const settings = {
  controlScheme: localStorage.getItem('controlScheme') ?? 'keyboard',
};

export function setControlScheme(value) {
  settings.controlScheme = value;
  localStorage.setItem('controlScheme', value);
}