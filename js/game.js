// js/game.js
import { isColliding, resolveCollision, isNear } from "./engine/collision.js";
import { loadLevel } from "./levels/loader.js";
import { level1_1 } from "./levels/level1_1.js";
import { RENDER_SCALE } from "./utils/constants.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let lastTime = 0;


let gameState = {
  score: 0,
  coins: 0,
  lives: 3,
  time: 400 
};

let camera = {
  x: 0,      // left edge of camera in world coords
  y: 0,      // for now always 0 (no vertical scrolling)
  width: canvas.width / RENDER_SCALE,
  height: canvas.height / RENDER_SCALE
};


// Load the level
const { entities, mario } = loadLevel(level1_1);

function update(deltaTime) {
  entities.forEach(e => e.update(deltaTime));

  mario.onGround = false;

  // Solid collisions
  entities.forEach(e => {
    if (e !== mario && e.isSolid && isNear(mario, e, 400)) {
      if (isColliding(mario, e)) {
        const result = resolveCollision(mario, e);
        if (result && result.axis === "y" && result.side === "bottom") {
          mario.onGround = true;
          mario.isJumping = false;
        }
      }
    }
  });

  // Coin collection
  entities.forEach(e => {
    if (e.constructor.name === "Coin" && !e.collected) {
      if (isColliding(mario, e)) {
        e.collected = true;
        gameState.coins += 1;
        gameState.score += 200; // classic Mario: 200 points per coin
      }
    }
  });

  // Timer update (smooth)
  gameState.time -= deltaTime;
  if (gameState.time < 0) gameState.time = 0;


  // Move camera forward if Mario passes the right edge
  if (mario.x > camera.x + camera.width / 2) {
    camera.x = mario.x - camera.width / 2;
  }

  // Clamp so camera never moves left
  if (camera.x < 0) {
    camera.x = 0;
}
}

function render() {
  ctx.fillStyle = "#5c94fc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  entities.forEach(e => e.render(ctx));

  renderUI();
}

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  update(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}

function renderUI() {
  ctx.fillStyle = "Black";
  ctx.fillRect(0,0,canvas.width, 50)

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";

  ctx.fillText(`MARIO`, (canvas.width/4)*0+20, 20);
  ctx.fillText(gameState.score.toString().padStart(6, "0"), (canvas.width/4)*0+20, 40);

  ctx.fillText(`COINS`, (canvas.width/4)*1+20, 20);
  ctx.fillText(`x ${gameState.coins}`, (canvas.width/4)*1+20, 40);

  ctx.fillText(`LIVES`, (canvas.width/4)*2+20, 20);
  ctx.fillText(gameState.lives, (canvas.width/4)*2+20, 40);

  ctx.fillText(`TIME`, (canvas.width/4)*3+20, 20);
  ctx.fillText(Math.floor(gameState.time), (canvas.width/4)*3+20, 40); // only whole numbers
  console.log(camera.x)

}



requestAnimationFrame(gameLoop);
