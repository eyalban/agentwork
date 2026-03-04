'use client';

import { generateFloorLayout, TileType, FurnitureType } from './FloorLayout';
import PixelCharacter from './PixelCharacter';

const TILE_SIZE = 32;

const TILE_COLORS: Record<TileType, string> = {
  'floor': '#c8b88a',
  'floor-alt': '#b8a878',
  'wall': '#6b5b3a',
  'wall-top': '#8b7b5a',
  'door': '#4a3520',
};

function FurniturePiece({ type, x, y }: { type: FurnitureType; x: number; y: number }) {
  const left = x * TILE_SIZE;
  const top = y * TILE_SIZE;

  switch (type) {
    case 'desk':
      return (
        <div style={{
          position: 'absolute', left, top, width: TILE_SIZE, height: TILE_SIZE, zIndex: y,
        }}>
          <svg width={TILE_SIZE} height={TILE_SIZE} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            <rect x="1" y="4" width="14" height="8" fill="#8b6914" />
            <rect x="1" y="4" width="14" height="2" fill="#a07828" />
            <rect x="2" y="12" width="2" height="4" fill="#6b4c0a" />
            <rect x="12" y="12" width="2" height="4" fill="#6b4c0a" />
          </svg>
        </div>
      );

    case 'computer':
      return (
        <div style={{
          position: 'absolute', left, top, width: TILE_SIZE, height: TILE_SIZE, zIndex: y + 1,
        }}>
          <svg width={TILE_SIZE} height={TILE_SIZE} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            {/* Monitor */}
            <rect x="3" y="4" width="10" height="8" fill="#333" />
            <rect x="4" y="5" width="8" height="6" fill="#1a2a1a" style={{
              animation: 'pulse-glow 3s ease-in-out infinite',
            }} />
            {/* Screen glow lines */}
            <rect x="5" y="6" width="6" height="1" fill="#00ff41" opacity="0.7" />
            <rect x="5" y="8" width="4" height="1" fill="#00ff41" opacity="0.5" />
            {/* Stand */}
            <rect x="7" y="12" width="2" height="2" fill="#555" />
            <rect x="5" y="14" width="6" height="1" fill="#555" />
          </svg>
        </div>
      );

    case 'plant':
      return (
        <div style={{
          position: 'absolute', left, top, width: TILE_SIZE, height: TILE_SIZE, zIndex: y,
        }}>
          <svg width={TILE_SIZE} height={TILE_SIZE} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            {/* Leaves */}
            <rect x="6" y="2" width="4" height="3" fill="#2d8b2d" />
            <rect x="4" y="4" width="3" height="3" fill="#3a9a3a" />
            <rect x="9" y="4" width="3" height="3" fill="#3a9a3a" />
            <rect x="7" y="3" width="2" height="5" fill="#228b22" />
            {/* Stem */}
            <rect x="7" y="8" width="2" height="3" fill="#2d5a1e" />
            {/* Pot */}
            <rect x="5" y="11" width="6" height="4" fill="#8b4513" />
            <rect x="6" y="10" width="4" height="1" fill="#a05a2c" />
          </svg>
        </div>
      );

    case 'whiteboard':
      return (
        <div style={{
          position: 'absolute', left, top, width: TILE_SIZE, height: TILE_SIZE, zIndex: y,
        }}>
          <svg width={TILE_SIZE} height={TILE_SIZE} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            <rect x="1" y="1" width="14" height="10" fill="#f0f0f0" />
            <rect x="1" y="1" width="14" height="1" fill="#999" />
            <rect x="3" y="4" width="8" height="1" fill="#e94560" />
            <rect x="3" y="6" width="6" height="1" fill="#4fc3f7" />
            <rect x="3" y="8" width="10" height="1" fill="#69f0ae" />
            <rect x="7" y="11" width="2" height="5" fill="#666" />
          </svg>
        </div>
      );

    case 'coffee':
      return (
        <div style={{
          position: 'absolute', left, top, width: TILE_SIZE, height: TILE_SIZE, zIndex: y,
        }}>
          <svg width={TILE_SIZE} height={TILE_SIZE} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            <rect x="4" y="4" width="8" height="10" fill="#555" />
            <rect x="4" y="4" width="8" height="2" fill="#666" />
            {/* Cup */}
            <rect x="6" y="2" width="3" height="2" fill="#ddd" />
            {/* Steam */}
            <rect x="7" y="0" width="1" height="2" fill="#ccc" opacity="0.5" />
            <rect x="5" y="14" width="6" height="2" fill="#444" />
          </svg>
        </div>
      );

    case 'chair':
      return (
        <div style={{
          position: 'absolute', left, top, width: TILE_SIZE, height: TILE_SIZE, zIndex: y,
        }}>
          <svg width={TILE_SIZE} height={TILE_SIZE} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
            <rect x="4" y="6" width="8" height="6" fill="#444" />
            <rect x="4" y="4" width="8" height="2" fill="#555" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}

interface FloorMember {
  agent_id: string;
  agent_name: string;
  agent_avatar_seed: string;
  latest_activity: string | null;
  role: string;
}

export default function FloorCanvas({
  floorSeed,
  members,
}: {
  floorSeed: string;
  members: FloorMember[];
}) {
  const activeMembers = members.filter(m => m.agent_id);
  const memberIds = activeMembers.map(m => m.agent_id);
  const layout = generateFloorLayout(floorSeed, memberIds, activeMembers.length);

  return (
    <div style={{
      position: 'relative',
      width: layout.cols * TILE_SIZE,
      height: layout.rows * TILE_SIZE + 20,
      margin: '0 auto',
      overflow: 'visible',
      border: '3px solid var(--gb-darkest)',
      background: '#c8b88a',
    }}>
      {/* Tiles */}
      {layout.tiles.map((tile, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: tile.x * TILE_SIZE,
            top: tile.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            background: TILE_COLORS[tile.type],
            borderRight: tile.type.includes('floor') ? '1px solid rgba(0,0,0,0.05)' : undefined,
            borderBottom: tile.type.includes('floor') ? '1px solid rgba(0,0,0,0.05)' : undefined,
          }}
        />
      ))}

      {/* Furniture */}
      {layout.furniture.map(item => (
        <FurniturePiece key={item.id} type={item.type} x={item.x} y={item.y} />
      ))}

      {/* Characters */}
      {layout.agentPositions.map(pos => {
        const member = activeMembers.find(m => m.agent_id === pos.agentId);
        if (!member) return null;
        return (
          <PixelCharacter
            key={pos.agentId}
            name={member.agent_name}
            avatarSeed={member.agent_avatar_seed}
            x={pos.x}
            y={pos.y}
            latestActivity={member.latest_activity}
          />
        );
      })}
    </div>
  );
}
