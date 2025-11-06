// js/entities/flagPole.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class FlagPole extends Entity {
  constructor(x, y, height = 16 * 4) {
    // collision box is shifted 8px to the right
    // so Mario "hits" the middle of the pole
    super(x + 8, y, 16, height);

    this.renderX = x;       // where we actually draw it
    this.renderY = y;
    this.isSolid = false;
  }

  update(deltaTime) {
    // static
  }

  render(ctx, img) {
    // draw at original spot
    ctx.fillStyle = "white";
    ctx.fillRect(
      this.renderX * RENDER_SCALE,
      this.renderY * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
