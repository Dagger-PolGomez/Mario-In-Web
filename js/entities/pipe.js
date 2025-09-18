// js/entities/pipe.js
import { Entity } from "./entity.js";

export class Pipe extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = true;
  }

  update(deltaTime) {
    // Static
  }

  render(ctx) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

