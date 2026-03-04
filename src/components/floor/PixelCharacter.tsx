'use client';

import { useEffect, useState } from 'react';

const TILE_SIZE = 32;

// Deterministic color from seed
function seedToColor(seed: string, offset: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i) + offset) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

function seedToSkinTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 3) - hash + seed.charCodeAt(i)) | 0;
  }
  const tones = ['#f5d0a9', '#e8b88a', '#c68642', '#8d5524', '#f3c9a8', '#d4a574'];
  return tones[Math.abs(hash) % tones.length];
}

export default function PixelCharacter({
  name,
  avatarSeed,
  x,
  y,
  latestActivity,
}: {
  name: string;
  avatarSeed: string;
  x: number;
  y: number;
  latestActivity?: string | null;
}) {
  const [frame, setFrame] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    // Idle animation - slight movement
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 600 + Math.random() * 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cycle bubble visibility
    if (latestActivity) {
      const show = setInterval(() => {
        setShowBubble(s => !s);
      }, 5000 + Math.random() * 3000);
      return () => clearInterval(show);
    }
  }, [latestActivity]);

  const shirtColor = seedToColor(avatarSeed, 0);
  const hairColor = seedToColor(avatarSeed, 100);
  const skinColor = seedToSkinTone(avatarSeed);

  const bobOffset = frame % 2 === 0 ? 0 : -1;
  const isTyping = frame >= 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x * TILE_SIZE,
        top: y * TILE_SIZE + bobOffset,
        width: TILE_SIZE,
        height: TILE_SIZE,
        zIndex: y + 10,
        transition: 'top 0.3s ease',
      }}
    >
      {/* Speech bubble */}
      {latestActivity && showBubble && (
        <div
          style={{
            position: 'absolute',
            bottom: TILE_SIZE + 4,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'white',
            color: '#333',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '5px',
            padding: '4px 6px',
            border: '2px solid #333',
            boxShadow: '2px 2px 0 #333',
            maxWidth: '130px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 100,
            lineHeight: '1.4',
          }}
        >
          {latestActivity.length > 35
            ? latestActivity.slice(0, 32) + '...'
            : latestActivity}
          {/* Bubble tail */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '6px solid #333',
            }}
          />
        </div>
      )}

      {/* Character body using CSS pixel art */}
      <svg
        width={TILE_SIZE}
        height={TILE_SIZE}
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Hair */}
        <rect x="5" y="1" width="6" height="3" fill={hairColor} />
        <rect x="4" y="2" width="1" height="2" fill={hairColor} />
        <rect x="11" y="2" width="1" height="2" fill={hairColor} />

        {/* Head */}
        <rect x="5" y="3" width="6" height="4" fill={skinColor} />

        {/* Eyes */}
        <rect x="6" y="4" width="1" height="1" fill={frame === 1 ? skinColor : '#333'} />
        <rect x="9" y="4" width="1" height="1" fill={frame === 1 ? skinColor : '#333'} />

        {/* Body/Shirt */}
        <rect x="4" y="7" width="8" height="4" fill={shirtColor} />

        {/* Arms */}
        <rect
          x="3"
          y={isTyping ? 8 : 7}
          width="1"
          height="3"
          fill={shirtColor}
        />
        <rect
          x="12"
          y={isTyping ? 8 : 7}
          width="1"
          height="3"
          fill={shirtColor}
        />

        {/* Hands */}
        <rect x="3" y={isTyping ? 11 : 10} width="1" height="1" fill={skinColor} />
        <rect x="12" y={isTyping ? 11 : 10} width="1" height="1" fill={skinColor} />

        {/* Legs/Pants */}
        <rect x="5" y="11" width="2" height="3" fill="#445" />
        <rect x="9" y="11" width="2" height="3" fill="#445" />

        {/* Shoes */}
        <rect x="4" y="14" width="3" height="2" fill="#333" />
        <rect x="9" y="14" width="3" height="2" fill="#333" />
      </svg>

      {/* Name label */}
      <div
        style={{
          position: 'absolute',
          bottom: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '5px',
          color: 'var(--gb-lightest)',
          textShadow: '1px 1px 0 rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {name}
      </div>
    </div>
  );
}
