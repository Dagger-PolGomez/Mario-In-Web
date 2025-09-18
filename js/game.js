// js/game.js
import { isColliding, resolveCollision, isNear } from "./engine/collision.js";
import { loadLevel } from "./levels/loader.js";
import { level1_1 } from "./levels/level1_1.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastTime = 0;

// Load the level
const { entities, mario } = loadLevel(level1_1);

function update(deltaTime) {
  // Reset ground state before checks
  mario.onGround = false;

  entities.forEach(e => e.update(deltaTime));

  // Mario vs nearby solid entities
  entities.forEach(e => {
    if (e !== mario && e.isSolid && isNear(mario, e, 400)) {
      if (isColliding(mario, e)) {
        const result = resolveCollision(mario, e);
        if (result && result.axis === "y" && result.other.isSolid) {
          // Mario is standing on something
          mario.onGround = true;
        }
      }
    }
  });
}

function render() {
  ctx.fillStyle = "#5c94fc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  entities.forEach(e => e.render(ctx));
}

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(deltaTime);
  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
