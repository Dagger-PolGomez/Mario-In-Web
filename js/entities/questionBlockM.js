// js/entities/questionBlockM.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class QuestionBlockM extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = true;

    this.used = false;
    this.bounceY = 0;
    this.bounceSpeed = 0;

    // sprite (unused=question, used=empty)
    this.SSx = 0; // question
    this.SSy = 1; // row of blocks/questions
  }

  hit(marioSize) {
    if (this.used) return null;
    this.used = true;
    this.SSx = 3; // switch to "empty" sprite in sheet
    this.SSy = 0; // switch to "empty" sprite in sheet
    this.bounceSpeed = -3; // bounce anim

    // tell game to spawn a mushroom
    return {
      spawn: {
        kind: "mushroom",
        x: this.x,
        startY: this.y, // emerge from inside block
        targetY: this.y - this.height, // finish one tile above
      },
    };
  }

  update(deltaTime) {
    if (this.bounceSpeed !== 0 || this.bounceY !== 0) {
      this.bounceY += this.bounceSpeed;
      this.bounceSpeed += 0.5;
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
      160,
      160,
      drawX,
      drawY,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
