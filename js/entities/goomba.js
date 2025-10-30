// js/entities/goomba.js
import { Entity } from "./entity.js";
import { GRAVITY, MOVE_SPEED, RENDER_SCALE } from "../utils/constants.js";

// animation settings (hard-coded to your sprite sheet)
const WALK_FRAMES = [
  { x: 1, y: 3 },
  { x: 2, y: 3 }
];
const ANIM_FPS = 8; // 8 frames per second → toggle every 0.125s

// squashed sprite (adjust if needed)
const SQUASH = { x: 3, y: 3 };

export class Goomba extends Entity {
  constructor(x, y) {
    super(x, y, 16, 16);
    this.isSolid = false;
    this.onGround = false;

    this.dir = -1;
    this.speed = MOVE_SPEED * 0.6;
    this.vx = this.dir * this.speed;
    this.vy = 0;
    this.flipCooldown = 0;

    // animation state
    this._frameIndex = 0;
    this._frameTime = 0;
    this.SSx = WALK_FRAMES[0].x;
    this.SSy = WALK_FRAMES[0].y;

    // death
    this.dead = false;
    this.deathTimer = 0;
    this.remove = false;
  }

  stomp() {
    if (this.dead) return;
    this.dead = true;
    this.vx = 0;
    this.vy = 0;
    this.SSx = SQUASH.x;
    this.SSy = SQUASH.y;
    this.deathTimer = 0.25; // delay before removal
  }

  update(deltaTime) {
    if (this.dead) {
      this.deathTimer -= deltaTime;
      if (this.deathTimer <= 0) this.remove = true;
      return;
    }

    if (this.flipCooldown > 0) this.flipCooldown -= deltaTime;

    // physics
    this.vx = this.dir * this.speed;
    this.vy += GRAVITY * deltaTime;

    // two-frame walking animation
    this._frameTime += deltaTime;
    if (this._frameTime >= 1 / ANIM_FPS) {
      this._frameTime -= 1 / ANIM_FPS;
      this._frameIndex = (this._frameIndex + 1) % WALK_FRAMES.length;
      this.SSx = WALK_FRAMES[this._frameIndex].x;
      this.SSy = WALK_FRAMES[this._frameIndex].y;
    }

    super.update(deltaTime);
  }

  render(ctx, img) {
    img.src = "./media/BlocksSpriteSheet.png";
    ctx.drawImage(
      img,
      this.SSx * 160, this.SSy * 160, 160, 160,
      this.x * RENDER_SCALE, this.y * RENDER_SCALE,
      this.width * RENDER_SCALE, this.height * RENDER_SCALE
    );
  }
}
