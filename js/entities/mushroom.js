// js/entities/mushroom.js
import { Entity } from "./entity.js";
import { GRAVITY, MOVE_SPEED, RENDER_SCALE } from "../utils/constants.js";

export class Mushroom extends Entity {
  constructor(x, startY, targetY) {
    super(x, startY, 16, 16);
    this.isSolid = false;

    // emerge state
    this.state = "emerging"; // "emerging" -> "active"
    this.targetY = targetY;  // typically block.y - 16
    this.emergeSpeed = 60;   // px/s upward

    // active movement
    this.dir = 1;                         // start moving right
    this.speed = MOVE_SPEED * 0.6;
    this.vx = 0;
    this.vy = 0;

    // temp sprite indices (adjust to your sheet)
    this.SSx = 2;
    this.SSy = 2;
  }

  update(deltaTime) {
    if (this.state === "emerging") {
      // move up until fully outside
      this.y -= this.emergeSpeed * deltaTime;
      if (this.y <= this.targetY) {
        this.y = this.targetY;
        this.state = "active";
      }
      return;
    }

    // active physics
    this.vx = this.dir * this.speed;
    this.vy += GRAVITY * deltaTime;

    super.update(deltaTime);
  }

  render(ctx, img) {
    img.src = "./media/BlocksSpriteSheet.png";
    ctx.drawImage(
      img,
      this.SSx * 160, this.SSy * 160,
      160, 160,
      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
