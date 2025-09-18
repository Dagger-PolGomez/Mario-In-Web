// js/engine/input.js

// Stores current key states
const keys = {};

// Event listeners
window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Public function to check if a key is pressed
export function isKeyDown(code) {
  return !!keys[code];
}
