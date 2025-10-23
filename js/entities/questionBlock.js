// js/entities/questionBlock.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class QuestionBlock extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = true;

    this.used = false;      // has Mario already hit it?
    this.bounceY = 0;       // small upward bounce offset
    this.bounceSpeed = 0;   // animation control

    // sprite sheet position
    this.SSx = 0;
    this.SSy = 1;
  }

  hit() {
    if (this.used) return false;

    this.used = true;
    this.SSx = 1; // switch to "empty" sprite in sheet
    this.SSy = 2; // switch to "empty" sprite in sheet
    this.bounceSpeed = -3; // quick upward bounce

    return true; // signal that Mario got a reward
  }

  update(deltaTime) {
    // simple bounce animation
    if (this.bounceSpeed !== 0 || this.bounceY !== 0) {
      this.bounceY += this.bounceSpeed;
      this.bounceSpeed += 0.5; // gravity for bounce
      if (this.bounceY > 0) {
        this.bounceY = 0;
        this.bounceSpeed = 0;
      }
    }
  }

  render(ctx, img) {
    img.src = "./media/BlocksSpriteSheet.png";

    const drawX = this.x * RENDER_SCALE;
    const drawY = (this.y + this.bounceY) * RENDER_SCALE;

    ctx.drawImage(
      img,
      this.SSx * 160,
      this.SSy * 160,
      160, 160,
      drawX,
      drawY,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
