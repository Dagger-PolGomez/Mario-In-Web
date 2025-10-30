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

// Resolve collision by pushing entity out of block (prev-position aware)
export function resolveCollision(mover, block) {
  const dx = (mover.x + mover.width / 2) - (block.x + block.width / 2);
  const dy = (mover.y + mover.height / 2) - (block.y + block.height / 2);
  const halfW = (mover.width + block.width) / 2;
  const halfH = (mover.height + block.height) / 2;

  let overlapX = halfW - Math.abs(dx);
  let overlapY = halfH - Math.abs(dy);

  if (overlapX <= 0 || overlapY <= 0) return null;

  // If we have previous frame bounds, use them to disambiguate axis/side
  const hasPrev = (typeof mover.prevX === "number" && typeof mover.prevY === "number");
  if (hasPrev) {
    const prev = {
      left:   mover.prevX,
      right:  mover.prevX + mover.width,
      top:    mover.prevY,
      bottom: mover.prevY + mover.height
    };
    
    const curB = {
      left:   block.x,
      right:  block.x + block.width,
      top:    block.y,
      bottom: block.y + block.height
    };

    // Entering from above -> vertical (land on top)
    if (prev.bottom <= curB.top) {
      mover.y -= overlapY;
      mover.vy = 0;
      return { axis: "y", side: "bottom", other: block };
    }

    // Entering from below -> vertical (head bump)
    if (prev.top >= curB.bottom) {
      mover.y += overlapY;
      mover.vy = 0;
      return { axis: "y", side: "top", other: block };
    }

    // Entering from left -> horizontal (hit right face of mover)
    if (prev.right <= curB.left) {
      mover.x -= overlapX;
      mover.vx = 0;
      return { axis: "x", side: "right", other: block };
    }

    // Entering from right -> horizontal (hit left face of mover)
    if (prev.left >= curB.right) {
      mover.x += overlapX;
      mover.vx = 0;
      return { axis: "x", side: "left", other: block };
    }
    // If none matched (rare corner cases), fall through to overlap comparison below
  }

  // Fallback: choose the smaller overlap (your original behavior)
  if (overlapX < overlapY) {
    // Horizontal push
    if (dx > 0) mover.x += overlapX;
    else        mover.x -= overlapX;
    mover.vx = 0;
    return { axis: "x", side: dx > 0 ? "right" : "left", other: block };
  } else {
    // Vertical push
    if (dy > 0) {
      mover.y += overlapY;   // head bump
      mover.vy = 0;
      return { axis: "y", side: "top", other: block };
    } else {
      mover.y -= overlapY;   // landed
      mover.vy = 0;
      return { axis: "y", side: "bottom", other: block };
    }
  }
}

// Broad-phase check: is entity within radius of mover?
export function isNear(a, b, radius = 500) {
  return distanceSq(a, b) <= radius * radius;
}
