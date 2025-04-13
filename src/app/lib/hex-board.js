import { Grid, defineHex, ring } from 'honeycomb-grid'
import { tileColours, resources } from './tiles';
import { shuffleArray } from './util';
import { Settlement } from './settlement';

const tileDimensions = 30;

class Tile extends defineHex({ dimensions: tileDimensions, origin: 'topLeft' }) {
    // colour: string;
    // resource: string;
    // type: string;
    // number: number;
    // isBlocked: boolean;
}

const randomTile = (tiles, numbers) => { 
    const randomIndex = Math.floor(Math.random() * tiles.length);
    const type = tiles[randomIndex];
    const hex = new Tile();
    hex.colour = tileColours[type];
    hex.resource = resources[type];
    hex.type = type;
    hex.number = type === 'Desert' ? null : Number(numbers[Math.floor(Math.random() * numbers.length)]);
    hex.isBlocked = false;

    return hex;
}

const newBoard = () => {
    // sums to 19
    const tileCount = {
        Forest: 4,
        Sheep: 4,
        Wheat: 4,
        Clay: 3,
        Mountain: 3,
        Desert: 1
    }
    // sums to 18 ( because 1 desert is null )
    const numberCount = {
        2: 1,
        3: 2,
        4: 2,
        5: 2,
        6: 2,
        8: 2,
        9: 2,
        10: 2,
        11: 2,
        12: 1
    }

    const gridList = [];
    
    const spiralCoords = shuffleArray([
        {q: 0, r: 0},  // center
        {q: 1, r: 0},  {q: 0, r: 1},  {q: -1, r: 1}, 
        {q: -1, r: 0}, {q: -1, r: -1}, {q: 0, r: -1},
        {q: 1, r: -1}, {q: 2, r: -1}, {q: 2, r: 0},
        {q: 1, r: 1},  {q: 0, r: 2},  {q: -1, r: 2},
        {q: -2, r: 2}, {q: -2, r: 1}, {q: -2, r: 0},
        {q: 2, r: -2}, {q: 1, r: -2}, {q: 0, r: -2}
    ]);
    
    for (let i = 0; i < 19; i++) {
        const tile = randomTile(Object.keys(tileCount), Object.keys(numberCount));

        tileCount[tile.type]--;
        if (tileCount[tile.type] <= 0) {
            if (tile.type === 'Desert') {
                tile.isBlocked = true;
            }
            delete tileCount[tile.type];
        }
        if (tile.number !== null) {
            numberCount[tile.number]--;
            if (numberCount[tile.number] <= 0) {
                delete numberCount[tile.number];
            }
        }
        
        tile.q = spiralCoords[i].q;
        tile.r = spiralCoords[i].r;
        
        gridList.push(tile);
    }
    
    const grid = Grid.fromIterable(gridList, { dimensions: 30, origin: 'topLeft' })
    return grid;
}


const newSettlementFromClick = (grid, x, y, player) => {
    const clickedPoint = { x, y };
    const hex = grid.pointToHex(clickedPoint, { allowOutside: false });
    if (!hex) return null;

    // get the nearest point and save the distance
    let minDistance = Infinity;
    let point = null;
    for (const p of hex.corners) {
      const distance = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        point = p;
      }
    }

    if (minDistance > 6) return null;

    const nextToSettlement = [hex];

    const adjacent = grid.traverse(ring({ center: [hex.q, hex.r], start: [hex.q, hex.r + 1] }));
    for (const tile of adjacent) {
        const cornerExists = tile.corners.some(corner => {
            const dx = corner.x - point.x;
            const dy = corner.y - point.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            return distance <= 1;
        });
        
        if (cornerExists) {
            nextToSettlement.push(tile);
        }
    }

    return new Settlement(point.x, point.y, nextToSettlement, player);
}

export { Tile, newBoard, newSettlementFromClick };