import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class QuestionBlock extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = true;
  }

  update(deltaTime) {
    // Static
  }

  render(ctx,img) {
    const drawX = this.x * RENDER_SCALE;
    const drawY = this.y * RENDER_SCALE;
    const drawW = this.width * RENDER_SCALE;
    const drawH = this.height * RENDER_SCALE;

    // Yellow block
    ctx.fillStyle = "yellow";
    ctx.fillRect(drawX, drawY, drawW, drawH);

    // Black "?" placeholder
    ctx.fillStyle = "black";
    ctx.font = `${12 * RENDER_SCALE}px Arial`;
    ctx.fillText("?", drawX + drawW / 4, drawY + (drawH * 0.75));
  }
}
