// js/entities/flagPole.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class FlagPoleTop extends Entity {
  constructor(x, y, height = 16 * 4) {
    // collision box is shifted 8px to the right
    // so Mario "hits" the middle of the pole
    super(x, y, 16, height);

    this.renderX = x; // where we actually draw it
    this.renderY = y;
    this.isSolid = false;

    this.SSx = 4;
    this.SSy = 0;
  }

  update(deltaTime) {
    // static
  }


  render(ctx, img) {
    img.src = "./media/BlocksSpriteSheet.png";
    ctx.drawImage(
      img,
      this.SSx * 160,
      this.SSy * 160,
      160,
      160,

      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
