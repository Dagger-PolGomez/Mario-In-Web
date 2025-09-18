// js/entities/block.js
import { Entity } from "./entity.js";

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
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
