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
export type FurnitureType = 'desk' | 'computer' | 'plant' | 'whiteboard' | 'coffee' | 'chair' | 'rug';

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

  // Room must be large enough for desks with good spacing
  // Each agent needs ~4x4 area (desk + computer + agent + bubble space)
  const agentsPerRow = Math.min(3, memberCount);
  const agentRows = Math.ceil(memberCount / agentsPerRow);

  const cols = Math.max(14, 4 + agentsPerRow * 5);
  const rows = Math.max(12, 5 + agentRows * 5);

  const tiles: Tile[] = [];
  const furniture: FurnitureItem[] = [];
  const agentPositions: AgentPosition[] = [];

  // Generate tiles
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let type: TileType = 'floor';

      if (y === 0) {
        type = 'wall-top';
      } else if (y === 1) {
        type = 'wall';
      } else if (x === 0 || x === cols - 1) {
        type = 'wall';
      } else if (y === rows - 1) {
        if (x === Math.floor(cols / 2) || x === Math.floor(cols / 2) + 1) {
          type = 'door';
        } else {
          type = 'wall';
        }
      } else {
        type = (x + y) % 2 === 0 ? 'floor' : 'floor-alt';
      }

      tiles.push({ x, y, type });
    }
  }

  // Place desks with generous spacing
  const deskSpacingX = 5;
  const deskSpacingY = 5;
  // Center the desk grid in the room
  const gridWidth = (agentsPerRow - 1) * deskSpacingX;
  const gridHeight = (agentRows - 1) * deskSpacingY;
  const deskStartX = Math.floor((cols - gridWidth) / 2);
  const deskStartY = Math.max(4, Math.floor((rows - gridHeight) / 2));

  let deskIndex = 0;

  for (let row = 0; row < agentRows; row++) {
    const agentsThisRow = Math.min(agentsPerRow, memberCount - row * agentsPerRow);
    // Center this row if it has fewer agents
    const rowOffset = Math.floor((agentsPerRow - agentsThisRow) * deskSpacingX / 2);

    for (let col = 0; col < agentsThisRow; col++) {
      const dx = deskStartX + col * deskSpacingX + rowOffset;
      const dy = deskStartY + row * deskSpacingY;

      if (dx >= 1 && dx < cols - 1 && dy >= 2 && dy < rows - 2) {
        furniture.push({ x: dx, y: dy, type: 'desk', id: `desk_${deskIndex}` });
        furniture.push({ x: dx, y: dy - 1, type: 'computer', id: `comp_${deskIndex}` });

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

  // Decorations - plants in corners (away from desks)
  const plantPositions = [
    { x: 1, y: 2 },
    { x: cols - 2, y: 2 },
    { x: 1, y: rows - 2 },
    { x: cols - 2, y: rows - 2 },
  ];

  for (let i = 0; i < plantPositions.length; i++) {
    if (rng() > 0.2) {
      furniture.push({
        x: plantPositions[i].x,
        y: plantPositions[i].y,
        type: 'plant',
        id: `plant_${i}`,
      });
    }
  }

  // Whiteboard on top wall area
  if (cols > 10) {
    furniture.push({
      x: Math.floor(cols / 2),
      y: 2,
      type: 'whiteboard',
      id: 'whiteboard_0',
    });
  }

  // Coffee machine
  if (rng() > 0.2) {
    furniture.push({
      x: cols - 3,
      y: 2,
      type: 'coffee',
      id: 'coffee_0',
    });
  }

  // Rug in center for visual variety
  if (memberCount >= 3 && rng() > 0.4) {
    const rugX = Math.floor(cols / 2);
    const rugY = Math.floor(rows / 2) + 1;
    furniture.push({ x: rugX, y: rugY, type: 'rug', id: 'rug_0' });
  }

  return { tiles, furniture, agentPositions, cols, rows };
}
