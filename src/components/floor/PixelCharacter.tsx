'use client';

import { useEffect, useState } from 'react';

const TILE_SIZE = 32;

function seedToColor(seed: string, offset: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i) + offset) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

function seedToSkinTone(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 3) - hash + seed.charCodeAt(i)) | 0;
  }
  const tones = ['#f5d0a9', '#e8b88a', '#c68642', '#8d5524', '#f3c9a8', '#d4a574'];
  return tones[Math.abs(hash) % tones.length];
}

function seedToHairStyle(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 4) - hash + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 3;
}

export default function PixelCharacter({
  name,
  avatarSeed,
  x,
  y,
  latestActivity,
  index = 0,
}: {
  name: string;
  avatarSeed: string;
  x: number;
  y: number;
  latestActivity?: string | null;
  index?: number;
}) {
  const [frame, setFrame] = useState(0);
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    // Stagger animation start times based on index
    const delay = index * 200;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setFrame(f => (f + 1) % 4);
      }, 700 + index * 100);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    if (!latestActivity) return;
    // Stagger bubble timing per agent to reduce overlap
    const interval = setInterval(() => {
      setShowBubble(s => !s);
    }, 4000 + index * 1500);
    return () => clearInterval(interval);
  }, [latestActivity, index]);

  const shirtColor = seedToColor(avatarSeed, 0);
  const hairColor = seedToColor(avatarSeed, 100);
  const skinColor = seedToSkinTone(avatarSeed);
  const hairStyle = seedToHairStyle(avatarSeed);

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
      {/* Speech bubble - positioned above with offset to avoid overlap */}
      {latestActivity && showBubble && (
        <div
          style={{
            position: 'absolute',
            bottom: TILE_SIZE + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffee',
            color: '#222',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            padding: '6px 8px',
            border: '2px solid #444',
            borderRadius: '2px',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
            maxWidth: '180px',
            lineHeight: '1.6',
            zIndex: 200 + index,
            pointerEvents: 'none',
            animation: 'float 3s ease-in-out infinite',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {latestActivity.length > 38
            ? latestActivity.slice(0, 35) + '...'
            : latestActivity}
          {/* Tail */}
          <div
            style={{
              position: 'absolute',
              bottom: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '7px solid #444',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '6px solid #ffffee',
            }}
          />
        </div>
      )}

      {/* Character body */}
      <svg
        width={TILE_SIZE}
        height={TILE_SIZE}
        viewBox="0 0 16 16"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Hair - varies by style */}
        {hairStyle === 0 && (
          <>
            <rect x="5" y="1" width="6" height="3" fill={hairColor} />
            <rect x="4" y="2" width="1" height="2" fill={hairColor} />
            <rect x="11" y="2" width="1" height="2" fill={hairColor} />
          </>
        )}
        {hairStyle === 1 && (
          <>
            <rect x="4" y="0" width="8" height="3" fill={hairColor} />
            <rect x="4" y="3" width="1" height="1" fill={hairColor} />
            <rect x="11" y="3" width="1" height="1" fill={hairColor} />
          </>
        )}
        {hairStyle === 2 && (
          <>
            <rect x="5" y="1" width="6" height="2" fill={hairColor} />
            <rect x="4" y="2" width="8" height="1" fill={hairColor} />
          </>
        )}

        {/* Head */}
        <rect x="5" y="3" width="6" height="4" fill={skinColor} />

        {/* Eyes - blink on frame 1 */}
        <rect x="6" y="4" width="1" height={frame === 1 ? 0.5 : 1.5} fill="#333" />
        <rect x="9" y="4" width="1" height={frame === 1 ? 0.5 : 1.5} fill="#333" />
        {/* Eye shine */}
        {frame !== 1 && (
          <>
            <rect x="6" y="4" width="0.5" height="0.5" fill="#fff" opacity="0.7" />
            <rect x="9" y="4" width="0.5" height="0.5" fill="#fff" opacity="0.7" />
          </>
        )}

        {/* Mouth */}
        <rect x="7" y="6" width="2" height="0.5" fill="#333" opacity="0.5" />

        {/* Body/Shirt */}
        <rect x="4" y="7" width="8" height="4" fill={shirtColor} />
        {/* Shirt detail - collar */}
        <rect x="6" y="7" width="4" height="1" fill={shirtColor} style={{ filter: 'brightness(1.2)' }} />

        {/* Arms */}
        <rect x="3" y={isTyping ? 8 : 7} width="1" height="3" fill={shirtColor} />
        <rect x="12" y={isTyping ? 8 : 7} width="1" height="3" fill={shirtColor} />

        {/* Hands */}
        <rect x="3" y={isTyping ? 11 : 10} width="1" height="1" fill={skinColor} />
        <rect x="12" y={isTyping ? 11 : 10} width="1" height="1" fill={skinColor} />

        {/* Pants */}
        <rect x="5" y="11" width="2" height="3" fill="#334" />
        <rect x="9" y="11" width="2" height="3" fill="#334" />
        {/* Pants split */}
        <rect x="7" y="11" width="2" height="1" fill="#334" />

        {/* Shoes */}
        <rect x="4" y="14" width="3" height="2" fill="#222" />
        <rect x="9" y="14" width="3" height="2" fill="#222" />
      </svg>

      {/* Name label */}
      <div
        style={{
          position: 'absolute',
          bottom: -16,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '7px',
          color: '#fff',
          textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
          whiteSpace: 'nowrap',
          textAlign: 'center',
          zIndex: 50,
          letterSpacing: '0.5px',
        }}
      >
        {name.length > 12 ? name.slice(0, 10) + '..' : name}
      </div>
    </div>
  );
}
