import { Entity } from "./entity.js";
import { isKeyDown } from "../engine/input.js";
import { GRAVITY, JUMP_FORCE, JUMP_HOLD, MAX_JUMP_TIME, MOVE_SPEED, RENDER_SCALE } from "../utils/constants.js";

export class Mario extends Entity {
  constructor(x, y) {
    super(x, y, 16, 32); // logical size stays small
    this.onGround = false;
    this.isJumping = false;
    this.jumpTime = 0;
    
    this.SSx = 0;
    this.SSy = 6;
    
    this.jumpSSx = 0;
    this.jumpSSy = 10;

    this.size = 2;
  }

  update(deltaTime) {
    this.vx = 0;
    if (isKeyDown("ArrowRight")) this.vx = MOVE_SPEED;
    if (isKeyDown("ArrowLeft")) this.vx = -MOVE_SPEED;

    if (isKeyDown("ArrowUp") && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
      this.isJumping = true;
      this.jumpTime = 0;
    }

    if (this.isJumping && isKeyDown("ArrowUp")) {
      this.jumpTime += deltaTime;
      if (this.jumpTime < MAX_JUMP_TIME) {
        this.vy += JUMP_HOLD * deltaTime;
      }
    }

    if (!isKeyDown("ArrowUp")) {
      this.isJumping = false;
    }

    this.vy += GRAVITY * deltaTime;
    super.update(deltaTime);
  }

  render(ctx,img) {

    img.src = "./media/BlocksSpriteSheet.png"

    if(this.isJumping){
    ctx.drawImage(img,
      this.jumpSSx*160,this.jumpSSy*160,
      160,320,
      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
    }
    else{
      ctx.drawImage(img,
      this.SSx*160,this.SSy*160,
      160,320,
      this.x * RENDER_SCALE,
      this.y * RENDER_SCALE,
      this.width * RENDER_SCALE,
      this.height * RENDER_SCALE
    );
    }
  }

}
