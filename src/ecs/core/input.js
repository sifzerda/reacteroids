// src/ecs/core/input.js

export const keys = {};

export const input = {
  fireDown: false,
  firePressed: false,
  fireReleased: false,
};

export const mouse = {

  x: 0,
  y: 0,

  worldX: 0,
  worldY: 0,

  down: false,
};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;

    if (e.code === 'Space') {

    if (!input.fireDown) {
      input.firePressed = true;
    }
    input.fireDown = true;
  }
});

window.addEventListener('keyup', (e) => {

  keys[e.code] = false;

  if (e.code === 'Space') {
    input.fireReleased = true;
    input.fireDown = false;
  }
});

window.addEventListener('mousemove', (e) => {

  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mousedown', () => {

  mouse.down = true;

  if (!input.fireDown) {
    input.firePressed = true;
  }
  input.fireDown = true;
});

window.addEventListener('mouseup', () => {

  mouse.down = false;
  input.fireReleased = true;
  input.fireDown = false;
});