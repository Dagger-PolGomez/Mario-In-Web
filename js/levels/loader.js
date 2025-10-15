// js/levels/loader.js
import { Block } from "../entities/block.js";
import { Mario } from "../entities/mario.js";
import { QuestionBlock } from "../entities/questionBlock.js";
import { Coin } from "../entities/coin.js";
import { PipeLT } from "../entities/pipeLT.js";
import { PipeRT } from "../entities/pipeRT.js";
import { PipeR } from "../entities/pipeR.js";
import { PipeL } from "../entities/pipeL.js";


import { TILE_SIZE } from "../utils/constants.js";

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
          // Mario: adjust so his feet rest on this tile
          mario = new Mario(x, y - TILE_SIZE);
          entities.push(mario);
          break;

        case "b":
          entities.push(new Block(x, y, TILE_SIZE));
          break;

        case "q":
          entities.push(new QuestionBlock(x, y, TILE_SIZE));
          break;

        case "c":
          entities.push(new Coin(x, y, TILE_SIZE));
          break;

        case "pLT":
          entities.push(new PipeLT(x, y, TILE_SIZE));
          break;
          
        case "pRT":
          entities.push(new PipeRT(x, y, TILE_SIZE));
          break;
        
        case "pR":
          entities.push(new PipeR(x, y, TILE_SIZE));
          break;

        case "pL":
          entities.push(new PipeL(x, y, TILE_SIZE));
          break;


        default:
          // Empty
          break;
      }
    }
  }

  return { entities, mario };
}


/*

m = Mario
b = Block
q = quesion Block
c = coin
p = pipe

*/