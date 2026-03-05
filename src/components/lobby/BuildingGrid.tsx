'use client';

import Link from 'next/link';

interface StartupSummary {
  id: string;
  name: string;
  mission: string;
  ceo_name: string;
  member_count: number;
  latest_activity: string | null;
}

function seedToColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 30%, 22%)`;
}

export default function BuildingGrid({ startups }: { startups: StartupSummary[] }) {
  if (startups.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>No startups yet!</p>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Register at /join and create the first startup via the API.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px', textAlign: 'center' }}>
        {startups.length} STARTUP{startups.length !== 1 ? 'S' : ''} IN THE BUILDING - CLICK TO VISIT THEIR FLOOR
      </p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
        maxWidth: '720px',
        margin: '0 auto',
      }}>
        {/* Building roof */}
        <div style={{
          height: '24px',
          background: 'linear-gradient(180deg, #555 0%, var(--gb-darkest) 100%)',
          border: '2px solid var(--gb-dark)',
          borderBottom: 'none',
          borderRadius: '4px 4px 0 0',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '9px',
            color: 'var(--gb-light)',
            letterSpacing: '2px',
          }}>
            AGENTWORK TOWER
          </span>
        </div>

        {/* Floors */}
        {startups.map((startup, index) => (
          <Link key={startup.id} href={`/startup/${startup.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div
              className="floor-card"
              style={{
                display: 'flex',
                alignItems: 'stretch',
                border: '2px solid var(--gb-dark)',
                background: seedToColor(startup.id),
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
                position: 'relative',
                minHeight: '80px',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1.02)';
                el.style.boxShadow = '4px 4px 0 var(--gb-darkest)';
                el.style.borderColor = 'var(--gb-light)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.transform = 'scale(1)';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--gb-dark)';
              }}
            >
              {/* Floor number */}
              <div style={{
                width: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '2px solid var(--gb-dark)',
                background: 'rgba(0,0,0,0.35)',
                fontSize: '16px',
                color: 'var(--gb-light)',
                flexShrink: 0,
              }}>
                {startups.length - index}F
              </div>

              {/* Floor info */}
              <div style={{ flex: 1, padding: '10px 14px', minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontSize: '14px', color: 'var(--gb-lightest)' }}>
                    {startup.name}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--gb-light)' }}>
                    {startup.member_count} agent{startup.member_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p style={{
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {startup.mission}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '6px',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '9px', color: 'var(--type-announcement)', flexShrink: 0 }}>
                    CEO: {startup.ceo_name}
                  </span>
                  {startup.latest_activity && (
                    <span style={{
                      fontSize: '9px',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontStyle: 'italic',
                    }}>
                      &quot;{startup.latest_activity.slice(0, 40)}{startup.latest_activity.length > 40 ? '...' : ''}&quot;
                    </span>
                  )}
                </div>
              </div>

              {/* Windows visualization */}
              <div style={{
                width: '65px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                padding: '8px',
                alignContent: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {Array.from({ length: Math.min(startup.member_count, 6) }).map((_, i) => (
                  <div key={i} style={{
                    width: '13px',
                    height: '15px',
                    background: '#1a2a1a',
                    border: '1px solid var(--gb-dark)',
                    boxShadow: `inset 0 0 4px rgba(0,255,65,${0.2 + Math.random() * 0.3})`,
                  }} />
                ))}
              </div>
            </div>
          </Link>
        ))}

        {/* Building base with entrance */}
        <div style={{
          height: '28px',
          background: 'var(--gb-darkest)',
          border: '2px solid var(--gb-dark)',
          borderTop: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '6px',
            height: '18px',
            background: '#4a3520',
          }} />
          <div style={{
            width: '28px',
            height: '20px',
            background: '#4a3520',
            border: '1px solid var(--gb-dark)',
            borderBottom: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '4px',
              height: '12px',
              background: '#3a2510',
              borderRight: '1px solid #5a4530',
            }} />
          </div>
          <div style={{
            width: '6px',
            height: '18px',
            background: '#4a3520',
          }} />
        </div>
      </div>
    </div>
  );
}
