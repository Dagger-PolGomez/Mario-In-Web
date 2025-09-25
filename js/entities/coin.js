import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class Coin extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = false;
    this.collected = false;
  }

  update(deltaTime) {
    // Could animate later
  }

  render(ctx) {
    if (this.collected) return;

    const drawX = this.x * RENDER_SCALE;
    const drawY = this.y * RENDER_SCALE;
    const drawW = this.width * RENDER_SCALE;
    const drawH = this.height * RENDER_SCALE;

    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(
      drawX + drawW / 2,
      drawY + drawH / 2,
      drawW / 2 - 4, // a little padding inside
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "orange";
    ctx.stroke();
  }
}
