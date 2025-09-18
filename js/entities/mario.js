import { Entity } from "./entity.js";
import { isKeyDown } from "../engine/input.js";
import { GRAVITY, JUMP_FORCE, MOVE_SPEED } from "../utils/constants.js";

export class Mario extends Entity {
  constructor(x, y) {
    super(x, y, 16, 32);
    this.onGround = false; // is Mario standing?
  }

  update(deltaTime) {
    // Horizontal input
    this.vx = 0;
    if (isKeyDown("ArrowRight")) {
      this.vx = MOVE_SPEED;
    }
    if (isKeyDown("ArrowLeft")) {
      this.vx = -MOVE_SPEED;
    }

    // Jump (only if on ground)
    if (isKeyDown("Space") && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
    }

    // Apply gravity
    this.vy += GRAVITY * deltaTime*0.001;

    // Apply movement
    super.update(deltaTime);
  }

  render(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
