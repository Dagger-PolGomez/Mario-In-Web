import { Entity } from "./entity.js";
import { isKeyDown } from "../engine/input.js";
import { GRAVITY, JUMP_FORCE, JUMP_HOLD, MAX_JUMP_TIME, MOVE_SPEED } from "../utils/constants.js";

export class Mario extends Entity {
  constructor(x, y) {
    super(x, y, 16, 32);
    this.onGround = false;

    this.isJumping = false;
    this.jumpTime = 0;
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

    // Start jump if on ground
    if (isKeyDown("Space") && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
      this.isJumping = true;
      this.jumpTime = 0;
    }

    // Continue jump if holding space and not exceeding max time
    if (this.isJumping && isKeyDown("Space")) {
      this.jumpTime += deltaTime;
      if (this.jumpTime < MAX_JUMP_TIME) {
        this.vy += JUMP_HOLD * deltaTime; // apply extra upward boost
      }
    }

    // Stop boosting if space released
    if (!isKeyDown("Space")) {
      this.isJumping = false;
    }

    // Apply gravity
    this.vy += GRAVITY * deltaTime;

    // Apply movement
    super.update(deltaTime);
  }

  render(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
