// js/entities/goomba.js
import { Entity } from "./entity.js";
import { GRAVITY, MOVE_SPEED, RENDER_SCALE } from "../utils/constants.js";

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

    // sprite (temp)
    this.SSx = 0; 
    this.SSy = 1;

    // death state
    this.dead = false;
    this.deathTimer = 0;     // seconds until removal after stomp
    this.remove = false;     // set true to delete from entities
  }

  stomp() {
    if (this.dead) return;
    this.dead = true;
    this.vx = 0;
    this.vy = 0;
    this.SSx = 1;            // optional: use a "squashed" frame if you have it
    this.deathTimer = 0.25;  // hang briefly before removal
  }

  update(deltaTime) {
    // death countdown
    if (this.dead) {
      this.deathTimer -= deltaTime;
      if (this.deathTimer <= 0) this.remove = true;
      return;
    }

    if (this.flipCooldown > 0) this.flipCooldown -= deltaTime;

    // walk
    this.vx = this.dir * this.speed;

    // gravity
    this.vy += GRAVITY * deltaTime;

    super.update(deltaTime);
  }

  render(ctx, img) {
    img.src = "./media/BlocksSpriteSheet.png";
    ctx.drawImage(
      img, this.SSx * 160, this.SSy * 160, 160, 160,
      this.x * RENDER_SCALE, this.y * RENDER_SCALE,
      this.width * RENDER_SCALE, this.height * RENDER_SCALE
    );
  }
}
