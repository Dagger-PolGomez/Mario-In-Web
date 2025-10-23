// js/game.js
import { isColliding, resolveCollision, isNear } from "./engine/collision.js";
import { loadLevel } from "./levels/loader.js";
import { level1_1 } from "./levels/level1_1.js";
import { RENDER_SCALE, JUMP_FORCE } from "./utils/constants.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const img = new Image();

let lastTime = 0;

let gameState = {
  score: 0,
  coins: 0,
  lives: 3,
  time: 400,
};

let camera = {
  x: 0, // left edge of camera in world coords
  y: 0, // for now always 0 (no vertical scrolling)
  width: canvas.width / RENDER_SCALE,
  height: canvas.height / RENDER_SCALE,
};

// Load the level
const { entities, mario } = loadLevel(level1_1);

function update(deltaTime) {
  entities.forEach((e) => e.update(deltaTime));

  mario.onGround = false;

  // Solid collisions
  entities.forEach((e) => {
    if (e !== mario && e.isSolid && isNear(mario, e, 400)) {
      if (isColliding(mario, e)) {
        const result = resolveCollision(mario, e);

        if (!result) return;

        // Mario landed on something
        if (result.axis === "y" && result.side === "bottom") {
          mario.onGround = true;
          mario.isJumping = false;
        }

        // Mario hit something from below
        else if (result.axis === "y" && result.side === "top") {
          if (e.constructor.name === "QuestionBlock" && !e.used) {
            if (e.hit()) {
              gameState.coins += 1;
              gameState.score += 200;
            }
          }
        }
      }
    }
  });

  // === Goomba vs solids (ground + walls) ===
  entities.forEach((mover) => {
    if (mover.constructor && mover.constructor.name === "Goomba") {
      mover.onGround = false;

      entities.forEach((sol) => {
        if (sol !== mover && sol.isSolid && isNear(mover, sol, 400)) {
          if (isColliding(mover, sol)) {
            const r = resolveCollision(mover, sol);
            if (!r) return;

            if (r.axis === "y" && r.side === "bottom") {
              mover.onGround = true; // landed
            }

            // ←→ hit a wall: flip direction (with tiny nudge + cooldown)
            if (r.axis === "x") {
              if (mover.flipCooldown <= 0) {
                mover.dir *= -1;
                mover.flipCooldown = 0.12; // ~120ms
                // nudge away from wall to prevent re-colliding same frame
                mover.x += r.side === "left" ? 0.5 : -0.5;
              }
            }
          }
        }
      });
    }
  });

  // === Mario vs Goombas: stomp to kill (vy > 0 from above) ===
  entities.forEach((e) => {
    if (e.constructor && e.constructor.name === "Goomba" && !e.dead) {
      if (isColliding(mario, e)) {
        // Determine vertical vs horizontal by comparing center overlaps (no extra moves)
        const dx = mario.x + mario.width / 2 - (e.x + e.width / 2);
        const dy = mario.y + mario.height / 2 - (e.y + e.height / 2);
        const halfW = (mario.width + e.width) / 2;
        const halfH = (mario.height + e.height) / 2;
        const overlapX = halfW - Math.abs(dx);
        const overlapY = halfH - Math.abs(dy);

        // Stomp if vertical overlap is the resolving axis AND Mario is above AND moving downward
        const marioAbove = dy < 0;
        const verticalHit = overlapY > 0 && overlapY <= overlapX;

        if (verticalHit && marioAbove && mario.vy > 0) {
          // stomp!
          e.stomp();
          gameState.score += 100;
          // small bounce
          mario.vy = JUMP_FORCE * 0.35; // tweak bounce strength as desired
          mario.onGround = false;
          mario.isJumping = true;
        } else {
          // TODO: side or bottom contact → damage Mario (not implemented yet)
          // For now, you can ignore or add knockback logic later.
        }
      }
    }
  });

  // Coin collection
  entities.forEach((e) => {
    if (e.constructor.name === "Coin" && !e.collected) {
      if (isColliding(mario, e)) {
        e.collected = true;
        gameState.coins += 1;
        gameState.score += 200; //Points
      }
    }
  });

  // Cleanup: remove flagged entities (dead goombas, etc.)
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].remove) {
      entities.splice(i, 1);
    }
  }

  // Timer update (smooth)
  gameState.time -= deltaTime;
  if (gameState.time < 0) gameState.time = 0;

  // Move camera forward if Mario passes the right edge
  if (mario.x - camera.x > camera.width / 2) {
    camera.x += RENDER_SCALE;
  }

  // Clamp so camera never moves left
  if (camera.x < 0) {
    camera.x = 0;
  }
}

function render() {
  ctx.fillStyle = "#5c94fc";
  ctx.fillRect(0, 0, canvas.width * 500, canvas.height);

  ctx.save();

  ctx.translate(-camera.x * RENDER_SCALE, 0);

  entities.forEach((e) => e.render(ctx, img));
  ctx.restore();
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
  ctx.restore();
  ctx.fillStyle = "Black";
  ctx.fillRect(0, 0, canvas.width, 50);

  ctx.fillStyle = "white";
  ctx.font = "16px Arial";

  ctx.fillText(`MARIO`, (canvas.width / 4) * 0 + 20, 20);
  ctx.fillText(
    gameState.score.toString().padStart(6, "0"),
    (canvas.width / 4) * 0 + 20,
    40
  );

  ctx.fillText(`COINS`, (canvas.width / 4) * 1 + 20, 20);
  ctx.fillText(`x ${gameState.coins}`, (canvas.width / 4) * 1 + 20, 40);

  ctx.fillText(`LIVES`, (canvas.width / 4) * 2 + 20, 20);
  ctx.fillText(gameState.lives, (canvas.width / 4) * 2 + 20, 40);

  ctx.fillText(`TIME`, (canvas.width / 4) * 3 + 20, 20);
  ctx.fillText(Math.floor(gameState.time), (canvas.width / 4) * 3 + 20, 40); // only whole numbers
}

requestAnimationFrame(gameLoop);

window.onload = function () {
  let canvas = document.getElementById("gameCanvas");
  let ctx = canvas.getContext("2d");

  var img = new Image();

  console.log(img.src);
};
