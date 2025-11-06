// js/entities/flagPole.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class FlagPole extends Entity {
  constructor(x, y, height = 16 * 4) {
    // width is narrow, height can be taller
    super(x, y, 16, height);
    this.isSolid = false;  // we only detect overlap
    this.SSx = 0;
    this.SSy = 0;
  }

  update(deltaTime) {
    // flagpole is static
  }

  render(ctx, img) {
    // temp render: white pole
    ctx.fillStyle = "white";
    ctx.fillRect(
      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
