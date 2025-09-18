// js/entities/entity.js

export class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.vx = 0; // horizontal velocity
    this.vy = 0; // vertical velocity
    this.isAlive = true;
  }

  update(deltaTime) {
    // Default movement
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  render(ctx) {
    // Placeholder render (override in subclasses)
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
