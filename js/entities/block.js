// js/entities/block.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class Block extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = true;
  }

  update(deltaTime) {
    // Static
  }

  render(ctx) {
    ctx.fillStyle = "brown";
    ctx.fillRect(
      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
