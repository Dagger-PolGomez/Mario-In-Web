import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class Coin extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = false;
    this.collected = false;
    this.SSx = 2;
    this.SSy = 2;
  }

  update(deltaTime) {
    // Could animate later
  }

  render(ctx,img) {
    if (this.collected) return;

    img.src = "./media/BlocksSpriteSheet.png"
    ctx.drawImage(img,
      this.SSx*160,
      this.SSy*160,
      160,
      160,

      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
  }
}
