// js/entities/questioBlock.js
import { Entity } from "./entity.js";

export class QuestionBlock extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = true; // Mario collides with it
  }

  update(deltaTime) {
    // Static for now
  }

  render(ctx) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Simple question mark placeholder
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText("?", this.x + 3, this.y + 12);
  }
}
