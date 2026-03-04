// Seeded PRNG (mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

export type TileType = 'floor' | 'floor-alt' | 'wall' | 'wall-top' | 'door';
export type FurnitureType = 'desk' | 'computer' | 'plant' | 'whiteboard' | 'coffee' | 'chair';

export interface Tile {
  x: number;
  y: number;
  type: TileType;
}

export interface FurnitureItem {
  x: number;
  y: number;
  type: FurnitureType;
  id: string;
}

export interface AgentPosition {
  agentId: string;
  x: number;
  y: number;
  deskX: number;
  deskY: number;
  facing: 'up' | 'down' | 'left' | 'right';
}

export interface FloorLayoutResult {
  tiles: Tile[];
  furniture: FurnitureItem[];
  agentPositions: AgentPosition[];
  cols: number;
  rows: number;
}

export function generateFloorLayout(
  seed: string,
  memberIds: string[],
  memberCount: number
): FloorLayoutResult {
  const rng = mulberry32(hashString(seed));

  // Room size scales with team
  const cols = Math.min(18, 10 + Math.floor(memberCount / 2) * 2);
  const rows = Math.min(14, 8 + Math.floor(memberCount / 3) * 2);

  const tiles: Tile[] = [];
  const furniture: FurnitureItem[] = [];
  const agentPositions: AgentPosition[] = [];

  // Generate tiles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let type: TileType = 'floor';

      // Walls
      if (y === 0) {
        type = 'wall-top';
      } else if (y === 1 && (x === 0 || x === cols - 1)) {
        type = 'wall';
      } else if (x === 0 || x === cols - 1) {
        type = 'wall';
      } else if (y === rows - 1) {
        // Bottom wall with door in center
        if (x === Math.floor(cols / 2) || x === Math.floor(cols / 2) + 1) {
          type = 'door';
        } else {
          type = 'wall';
        }
      } else if (y === 1) {
        type = 'wall';
      } else {
        // Checkerboard floor pattern
        type = (x + y) % 2 === 0 ? 'floor' : 'floor-alt';
      }

      tiles.push({ x, y, type });
    }
  }

  // Place desks in a grid pattern (each desk is 1 tile, with a computer on it)
  const deskStartX = 3;
  const deskStartY = 3;
  const deskSpacingX = 3;
  const deskSpacingY = 3;
  let deskIndex = 0;

  for (let row = 0; row < Math.ceil(memberCount / 3); row++) {
    for (let col = 0; col < Math.min(3, memberCount - row * 3); col++) {
      const dx = deskStartX + col * deskSpacingX;
      const dy = deskStartY + row * deskSpacingY;

      if (dx < cols - 2 && dy < rows - 2) {
        const deskId = `desk_${deskIndex}`;
        furniture.push({ x: dx, y: dy, type: 'desk', id: deskId });
        furniture.push({ x: dx, y: dy - 1, type: 'computer', id: `comp_${deskIndex}` });

        // Place agent at desk (sitting below it)
        if (deskIndex < memberIds.length) {
          agentPositions.push({
            agentId: memberIds[deskIndex],
            x: dx,
            y: dy + 1,
            deskX: dx,
            deskY: dy,
            facing: 'up',
          });
        }

        deskIndex++;
      }
    }
  }

  // Decorations
  // Plants in corners
  const plantPositions = [
    { x: 1, y: 2 },
    { x: cols - 2, y: 2 },
    { x: 1, y: rows - 2 },
    { x: cols - 2, y: rows - 2 },
  ];

  for (let i = 0; i < plantPositions.length; i++) {
    if (rng() > 0.3) {
      furniture.push({
        x: plantPositions[i].x,
        y: plantPositions[i].y,
        type: 'plant',
        id: `plant_${i}`,
      });
    }
  }

  // Whiteboard on top wall
  if (cols > 8) {
    furniture.push({
      x: Math.floor(cols / 2),
      y: 2,
      type: 'whiteboard',
      id: 'whiteboard_0',
    });
  }

  // Coffee machine
  if (rng() > 0.3) {
    furniture.push({
      x: cols - 3,
      y: 2,
      type: 'coffee',
      id: 'coffee_0',
    });
  }

  return { tiles, furniture, agentPositions, cols, rows };
}
