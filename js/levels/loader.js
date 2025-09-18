// js/levels/loader.js
import { Block } from "../entities/block.js";
import { Mario } from "../entities/mario.js";
// later: Goomba, Coin...

const TILE_SIZE = 16;

export function loadLevel(levelData) {
  const entities = [];
  let mario = null;

  const rows = levelData.tiles.length;
  const cols = levelData.tiles[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const symbol = levelData.tiles[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      switch (symbol) {
        case "m":
          mario = new Mario(x, y);
          entities.push(mario);
          break;

        case "b":
          entities.push(new Block(x, y, TILE_SIZE));
          break;

        // case "g":
        //   entities.push(new Goomba(x, y));
        //   break;

        // case "c":
        //   entities.push(new Coin(x, y));
        //   break;

        default:
          // empty space
          break;
      }
    }
  }

  return { entities, mario };
}
