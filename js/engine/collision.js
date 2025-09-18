// js/engine/collision.js

// Distance squared between two entities (center points)
function distanceSq(a, b) {
  const dx = (a.x + a.width / 2) - (b.x + b.width / 2);
  const dy = (a.y + a.height / 2) - (b.y + b.height / 2);
  return dx * dx + dy * dy;
}

// Check if two entities overlap
export function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Resolve collision by pushing entity out of block
export function resolveCollision(mover, block) {
  const dx = (mover.x + mover.width / 2) - (block.x + block.width / 2);
  const dy = (mover.y + mover.height / 2) - (block.y + block.height / 2);
  const width = (mover.width + block.width) / 2;
  const height = (mover.height + block.height) / 2;

  let overlapX = width - Math.abs(dx);
  let overlapY = height - Math.abs(dy);

  if (overlapX > 0 && overlapY > 0) {
    if (overlapX < overlapY) {
      // Horizontal push
      if (dx > 0) mover.x += overlapX;
      else mover.x -= overlapX;
      mover.vx = 0;
      return { axis: "x", other: block };
    } else {
      // Vertical push
      if (dy > 0) {
        // Pushed down (head bump)
        mover.y += overlapY;
        mover.vy = 0;
      } else {
        // Landed on top
        mover.y -= overlapY;
        mover.vy = 0;
        mover.onGround = true; // tell Mario he can jump
      }
      return { axis: "y", other: block };
    }
  }

  return null;
}

// Broad-phase check: is entity within radius of mover?
export function isNear(a, b, radius = 500) {
  return distanceSq(a, b) <= radius * radius;
}
