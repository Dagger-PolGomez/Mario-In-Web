// js/entities/brick.js
import { Entity } from "./entity.js";
import { RENDER_SCALE } from "../utils/constants.js";

export class Brick extends Entity {
    constructor(x, y, size = 16) {
        super(x, y, size, size);
        this.isSolid = true;
        this.SSx = 0;
        this.SSy = 2;
    }

    update(deltaTime) {
        if (this.deathTimer <= 0) this.remove = true;
    }

    hit() {

         this.remove = true;
        
    }


    render(ctx, img) {
        img.src = "./media/BlocksSpriteSheet.png"
        ctx.drawImage(img,
            this.SSx * 160, this.SSy * 160,
            160, 160,
            this.x * RENDER_SCALE,
            this.y * RENDER_SCALE,
            this.width * RENDER_SCALE,
            this.height * RENDER_SCALE
        );
    }
}
