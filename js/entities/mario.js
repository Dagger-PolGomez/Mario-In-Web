import { Entity } from "./entity.js";
import { isKeyDown } from "../engine/input.js";
import {
  GRAVITY,
  JUMP_FORCE,
  JUMP_HOLD,
  MAX_JUMP_TIME,
  MOVE_SPEED,
  RENDER_SCALE,
  INVINCIBLE_TIME,
  BLINK_RATE,
} from "../utils/constants.js";

import { AudioManager } from "../audio/audioManager.js";

// Sprite atlas parameters (adjust SSy rows to your sheet if needed)
const SRC_W = 160;
const SRC_H_SMALL = 160;
const SRC_H_BIG = 320;

// Using your current usage as baseline:
// Big:   idle row=6, run row=8, jump row=10
// Small: set these to the correct rows for your sheet.
// If your small rows are different, just tweak 12/14/16 below.
const MARIO_ANIM = {
  big: {
    idle: { row: 6, frames: [0] },
    run: { row: 8, frames: [0, 1, 2] },
    jump: { row: 10, frames: [0] },
  },
  small: {
    idle: { row: 3, frames: [0] },
    run: { row: 4, frames: [0, 1, 2] },
    jump: { row: 5, frames: [0] },
  },
};

export class Mario extends Entity {
  constructor(x, y) {
    super(x, y, 16, 32); // start big by default (2 tiles tall)

    this.onGround = false;
    this.isJumping = false;
    this.running = false;
    this.jumpTime = 0;

    this.renderDir = 1;

    this.invincibleTimer = 0;
    this.dead = false;

    // animation state
    this.curFrame = 0;
    this.frameTick = 0;

    // which bank we’re using (big/small)
    this.size = 1; // 2 => big (16x32), 1 => small (16x16)
    this.bank = "big"; // "big" | "small"
    this.srcH = SRC_H_BIG; // 320 for big, 160 for small

    // default rows (will be set by setSize)
    this.SSx = 0;
    this.SSy = MARIO_ANIM.big.idle.row;

    // initial apply
    this.setSize(1); // start big; call setSize(1) to go small
  }

  setSize(newSize) {
    if (newSize !== 1 && newSize !== 2) return;

    const keepFeet = this.y + this.height; // world-space feet Y

    this.size = newSize;
    this.bank = newSize === 2 ? "big" : "small";
    this.srcH = newSize === 2 ? SRC_H_BIG : SRC_H_SMALL;

    // logical collider
    this.width = 16;
    this.height = newSize === 2 ? 32 : 16;

    // keep feet position when resizing
    this.y = keepFeet - this.height;

    // reset to idle frame on resize
    this.curFrame = 0;
    this.frameTick = 0;
    this.SSx = 0;
    this.SSy = MARIO_ANIM[this.bank].idle.row;
  }

  update(deltaTime) {
    // tick i-frames
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= deltaTime;
      if (this.invincibleTimer < 0) this.invincibleTimer = 0;
    }

    // if dead, ignore input; just let gravity act
    if (this.dead) {
      this.vx = 0;
      this.vy += GRAVITY * deltaTime;
      return super.update(deltaTime);
    }
    this.vx = 0;

    // movement
    let isMoving = false;
    if (isKeyDown("ArrowRight")) {
      this.vx = MOVE_SPEED;
      this.renderDir = 1;
      isMoving = true;
    }
    if (isKeyDown("ArrowLeft")) {
      this.vx = -MOVE_SPEED;
      this.renderDir = -1;
      isMoving = true;
    }
    this.running = isMoving;

    // jump
    if (isKeyDown("ArrowUp") && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
      this.isJumping = true;
      this.jumpTime = 0;
      AudioManager.playSfx("./media/sfx/jump.wav");
    }
    if (this.isJumping && isKeyDown("ArrowUp")) {
      this.jumpTime += deltaTime;
      if (this.jumpTime < MAX_JUMP_TIME) this.vy += JUMP_HOLD * deltaTime;
    }
    if (!isKeyDown("ArrowUp") && this.onGround) this.isJumping = false;

    // pick animation row/frame
    if (this.isJumping) {
      this.SSy = MARIO_ANIM[this.bank].jump.row;
      this.SSx = MARIO_ANIM[this.bank].jump.frames[0]; // single frame
    } else if (this.running) {
      const run = MARIO_ANIM[this.bank].run;
      this.SSy = run.row;
      this.frameTick++;
      if (this.frameTick > 5) {
        // advance every 6 ticks
        this.frameTick = 0;
        this.curFrame = (this.curFrame + 1) % run.frames.length;
      }
      this.SSx = run.frames[this.curFrame];
    } else {
      const idle = MARIO_ANIM[this.bank].idle;
      this.SSy = idle.row;
      this.SSx = idle.frames[0];
      this.curFrame = 0;
      this.frameTick = 0;
    }

    // gravity + integrate
    this.vy += GRAVITY * deltaTime;
    super.update(deltaTime);

    // OPTIONAL: temp toggle to test small/big quickly:
    if (isKeyDown("KeyZ")) this.setSize(1);
    if (isKeyDown("KeyX")) this.setSize(2);
  }

  // Inside class Mario
  render(ctx, img) {
    img.src = "./media/BlocksSpriteSheet.png";

    const drawW = this.width * RENDER_SCALE;
    const drawH = this.height * RENDER_SCALE;
    const srcX = this.SSx * 160; // column in sheet
    const srcY = this.SSy * 160; // row in sheet
    const dstX = this.x * RENDER_SCALE;
    const dstY = this.y * RENDER_SCALE;

    ctx.save(); // contain alpha + transforms

    // Blink during i-frames
    if (this.invincibleTimer > 0) {
      const phase = Math.floor(this.invincibleTimer * 12) % 2; // 12 Hz
      ctx.globalAlpha = phase === 0 ? 0.4 : 1.0;
    }

    if (this.renderDir === -1) {
      // flip horizontally around the entity's left-right bounds
      ctx.translate((this.x + this.width) * RENDER_SCALE, dstY);
      ctx.scale(-1, 1);
      ctx.drawImage(
        img,
        srcX,
        srcY,
        160,
        this.srcH, // this.srcH = 320 (big) or 160 (small)
        0,
        0,
        drawW,
        drawH
      );
    } else {
      ctx.drawImage(img, srcX, srcY, 160, this.srcH, dstX, dstY, drawW, drawH);
    }

    ctx.restore(); // always restore alpha/transform
  }

  isInvincible() {
    return this.invincibleTimer > 0;
  }

  // Returns: 'ignored' | 'shrunk' | 'dead'
  takeDamage() {
    if (this.isInvincible() || this.dead) return "ignored";

    // Big → Small
    if (this.size === 2) {
      this.setSize(1);
      this.y += 8;
      this.invincibleTimer = INVINCIBLE_TIME; // reuse your existing i-frames only
      AudioManager.playSfx("./media/sfx/damage.wav");
      return "shrunk";
    }

    // Small → Dead
    else {
      this.dead = true;
      this.vx = 0;
      this.vy = -220; // death hop
      return "dead";
    }
  }

  death() {
    this.dead = true;
    this.vx = 0;
    this.vy = -220; // death hop
  }
}
