// js/game.js
import { isColliding, resolveCollision, isNear } from "./engine/collision.js";
import { loadLevel } from "./levels/loader.js";
import { level1_1 } from "./levels/level1_1.js";
import { RENDER_SCALE, JUMP_FORCE } from "./utils/constants.js";
import { Mushroom } from "./entities/mushroom.js";
import { AudioManager } from "./audio/audioManager.js";

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

// Active-band helper for movers (≈1.5x camera width)
function isInActiveBand(e) {
  const activeLeft = camera.x - camera.width * 0.25;
  const activeRight = camera.x + camera.width * 1.25;
  return e.x + e.width > activeLeft && e.x < activeRight;
}

// Load the level
const { entities, mario } = loadLevel(level1_1);
// === Music (starts only after first user interaction) ===
let musicStarted = false;
function startMusicOnce() {
  if (musicStarted) return;
  musicStarted = true;
  AudioManager.playMusic("./media/sfx/overworld.wav");
  window.removeEventListener("click", startMusicOnce);
  window.removeEventListener("keydown", startMusicOnce);
}
window.addEventListener("click", startMusicOnce);
window.addEventListener("keydown", startMusicOnce);

function update(deltaTime) {
  console.log(mario.x);

  // Lock left movement if Mario is at the left edge of the camera
  mario.leftLock = mario.x <= camera.x + 0.01;

  // 0) Tick all entities (movement integration etc.)
  entities.forEach((e) => {
    const name = e.constructor && e.constructor.name;

    // Only update movers (Goomba/Mushroom) when within active band.
    // Always update Mario and other entities.
    if (name === "Goomba" || name === "Mushroom") {
      e._active = isInActiveBand(e); // cache flag for later collision phase
      if (name === "Goomba" && e.dead) {
        // let dead goombas finish their death timer/removal
        e.update(deltaTime);
      } else if (e._active) {
        e.update(deltaTime);
      } else {
        // skipped while far off-screen
      }
    } else {
      e.update(deltaTime);
    }
  });

  // --- 1) Single classification pass + inline non-solid interactions ---
  const solids = [];
  const movers = []; // Goombas + Mushrooms for wall/ground resolving

  for (let i = 0; i < entities.length; i++) {
    // remove entities far below the level (and kill Mario if he falls)
    const e = entities[i];
    if (e.y > 300) {
      if (e === mario) {
        if (typeof mario.death === "function") {
          mario.death();
        }
        continue;
      }
      e.remove = true;
      continue;
    }

    if (e === mario) continue;

    // Collect solids for the two collision phases
    if (e.isSolid) {
      solids.push(e);
      continue; // solids handled in phase 2a
    }

    // Non-solid movers (need wall/ground collisions) -> collect for 2b
    const name = e.constructor && e.constructor.name;

    // Skip dead goombas right away
    if (name === "Goomba" && e.dead) continue;

    // Collect movers (Goombas + Mushrooms)
    if (name === "Goomba" || name === "Mushroom") {
      movers.push(e);
    }

    // ---- Non-solid Mario interactions: do them here, once ----
    if (!mario.dead) {
      // Mario vs Goomba: stomp/damage
      if (name === "Goomba" && !e.dead) {
        if (isColliding(mario, e)) {
          if (mario.vy > 0 && !mario.onGround) {
            e.stomp();
            gameState.score += 100;
            mario.vy = JUMP_FORCE * 0.35;
            mario.onGround = false;
            mario.isJumping = true;
            mario.invincibleTimer = 1 / 15;

            AudioManager.playSfx("./media/sfx/stomp.wav");
          } else {
            const outcome = mario.takeDamage();
            if (outcome === "dead") {
              gameState.lives = Math.max(0, gameState.lives - 1);
            }
          }
        }
      }

      // Mario vs Mushroom: power-up
      if (name === "Mushroom") {
        if (isColliding(mario, e)) {
          if (typeof mario.setSize === "function") mario.setSize(2);
          else {
            mario.size = 2;
            mario.width = 16;
            mario.height = 32;
          }
          mario.invincibleTimer = 0.2; // tiny grace
          gameState.score += 1000;
          e.remove = true;
          AudioManager.playSfx("./media/sfx/powerup.wav");
        }
      }

      // Mario vs Coin: collect
      if (name === "Coin" && !e.collected) {
        if (isColliding(mario, e)) {
          e.collected = true;
          gameState.coins += 1;
          gameState.score += 200;
          e.remove = true;
          AudioManager.playSfx("./media/sfx/coin.wav");
        }
      }

      // Mario vs Flagpole: end
      if (name === "FlagPole") {
        if (isColliding(mario, e)) {
          gameState.levelComplete = true;
          // optional SFX
          AudioManager.playSfx("./media/sfx/levelclear.wav");
        }
      }
    }
  }

  mario.onGround = false; // will be set true during solid resolution

  // --- 2a) Mario vs solids (includes question/brick logic) ---
  if (!mario.dead) {
    for (let i = 0; i < solids.length; i++) {
      const s = solids[i];
      if (!isNear(mario, s, 400)) continue; // perf
      if (!isColliding(mario, s)) continue;

      const result = resolveCollision(mario, s);
      if (!result) continue;

      if (result.axis === "y" && result.side === "bottom") {
        // Landed
        mario.onGround = true;
        mario.isJumping = false;
      } else if (result.axis === "y" && result.side === "top") {
        // Hit from below
        const name = s.constructor && s.constructor.name;

        // Coin question block
        if (name === "QuestionBlock" && !s.used) {
          if (s.hit(mario.size)) {
            gameState.coins += 1;
            gameState.score += 200;
            AudioManager.playSfx("./media/sfx/bump.wav");
          }
        }
        // Mushroom question block
        else if (name === "QuestionBlockM" && !s.used) {
          const res = s.hit(mario.size);
          if (res && res.spawn && res.spawn.kind === "mushroom") {
            entities.push(
              new Mushroom(res.spawn.x, res.spawn.startY, res.spawn.targetY)
            );
            AudioManager.playSfx("./media/sfx/powerupappears.wav");
          }
        }
        // Brick
        else if (name === "Brick") {
          if (mario.size == 2) {
            s.hit();
            AudioManager.playSfx("./media/sfx/bricksmash.wav");
          } else {
            AudioManager.playSfx("./media/sfx/bump.wav");
          }
        }
      }
    }
  }

  // --- 2b) Movers vs solids (Goombas + Mushrooms) ---
  entities.forEach((mover) => {
    const name = mover.constructor && mover.constructor.name;
    if (name === "Goomba" || name === "Mushroom") {
      if (name === "Goomba" && mover.dead) return; // dying ones ignore collisions
      if (!mover._active) return; // skip if outside active band

      mover.onGround = false;

      entities.forEach((sol) => {
        if (sol !== mover && sol.isSolid && isNear(mover, sol, 400)) {
          if (isColliding(mover, sol)) {
            const r = resolveCollision(mover, sol);
            if (!r) return;

            if (r.axis === "y" && r.side === "bottom") mover.onGround = true;

            if (r.axis === "x" && mover.dir != null) {
              if (mover.flipCooldown == null) mover.flipCooldown = 0;

              if (mover.flipCooldown <= 0) {
                mover.dir *= -1;
                mover.flipCooldown = 0.12;
                mover.x += r.side === "left" ? 0.5 : -0.5;
              }
            }
          }
        }
      });

      if (mover.flipCooldown && mover.flipCooldown > 0) {
        mover.flipCooldown -= deltaTime;
        if (mover.flipCooldown < 0) mover.flipCooldown = 0;
      }
    }
  });

  // --- 3) Cleanup ---
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].remove) entities.splice(i, 1);
  }

  // --- 4) Timer & camera ---
  gameState.time -= deltaTime;
  if (gameState.time < 0) gameState.time = 0;

  // Camera advance (only forward)
  if (mario.x - camera.x > camera.width / 2) {
    camera.x += RENDER_SCALE;
  }
  if (camera.x < 0) camera.x = 0;

  // Prevent Mario from moving left off-camera due to collisions
  if (mario.x < camera.x) mario.x = camera.x;

  // Level complete_ stop Mario and finish
  if (gameState.levelComplete) {
    mario.vx = 0;
    mario.leftLock = true;
    // you can also stop camera here if you want
    setTimeout(() => {
      location.reload(); // or load next level
    }, 2000);
  }

  // Simple death reload
  if (mario.dead) {
    setTimeout(() => {
      location.reload();
    }, 2000);
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
