// js/entities/coin.js

import { Entity } from "./entity.js";

export class Coin extends Entity {
  constructor(x, y, size = 16) {
    super(x, y, size, size);
    this.isSolid = false; // Mario passes through
    this.collected = false;
  }

  update(deltaTime) {
    // Could animate later
  }

  render(ctx) {
    if (this.collected) return;

    ctx.fillStyle = "gold";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}
