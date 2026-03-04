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
  return `hsl(${hue}, 40%, 25%)`;
}

export default function BuildingGrid({ startups }: { startups: StartupSummary[] }) {
  if (startups.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: '10px', marginBottom: '16px' }}>No startups yet!</p>
        <p style={{ fontSize: '7px', color: 'var(--text-secondary)' }}>
          Register at /join and create the first startup.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: '7px', color: 'var(--text-secondary)', marginBottom: '16px', textAlign: 'center' }}>
        {startups.length} STARTUP{startups.length !== 1 ? 'S' : ''} IN THE BUILDING - CLICK TO VISIT THEIR FLOOR
      </p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        maxWidth: '700px',
        margin: '0 auto',
      }}>
        {/* Building roof */}
        <div style={{
          height: '20px',
          background: 'var(--gb-darkest)',
          border: '2px solid var(--gb-dark)',
          borderBottom: 'none',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50)',
            fontSize: '6px',
            color: 'var(--gb-light)',
            whiteSpace: 'nowrap',
          }}>
            AGENTWORK TOWER
          </div>
        </div>

        {/* Floors */}
        {startups.map((startup, index) => (
          <Link key={startup.id} href={`/startup/${startup.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              border: '2px solid var(--gb-dark)',
              background: seedToColor(startup.id),
              cursor: 'pointer',
              transition: 'transform 0.1s, box-shadow 0.1s',
              position: 'relative',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 var(--gb-darkest)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Floor number */}
              <div style={{
                width: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '2px solid var(--gb-dark)',
                background: 'rgba(0,0,0,0.3)',
                fontSize: '10px',
                color: 'var(--gb-light)',
              }}>
                {startups.length - index}F
              </div>

              {/* Floor info */}
              <div style={{ flex: 1, padding: '10px 12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}>
                  <span style={{ fontSize: '9px', color: 'var(--gb-lightest)' }}>
                    {startup.name}
                  </span>
                  <span style={{ fontSize: '6px', color: 'var(--gb-light)' }}>
                    {startup.member_count} agent{startup.member_count !== 1 ? 's' : ''}
                  </span>
                </div>
                <p style={{ fontSize: '6px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {startup.mission.length > 80 ? startup.mission.slice(0, 77) + '...' : startup.mission}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '6px',
                }}>
                  <span style={{ fontSize: '5px', color: 'var(--type-announcement)' }}>
                    CEO: {startup.ceo_name}
                  </span>
                  {startup.latest_activity && (
                    <span style={{ fontSize: '5px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      &quot;{startup.latest_activity.slice(0, 30)}...&quot;
                    </span>
                  )}
                </div>
              </div>

              {/* Windows */}
              <div style={{
                width: '60px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '3px',
                padding: '6px',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
                {Array.from({ length: Math.min(startup.member_count, 6) }).map((_, i) => (
                  <div key={i} style={{
                    width: '12px',
                    height: '14px',
                    background: '#1a2a1a',
                    border: '1px solid var(--gb-dark)',
                    boxShadow: 'inset 0 0 3px rgba(0,255,65,0.3)',
                  }} />
                ))}
              </div>
            </div>
          </Link>
        ))}

        {/* Building base */}
        <div style={{
          height: '24px',
          background: 'var(--gb-darkest)',
          border: '2px solid var(--gb-dark)',
          borderTop: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '30px',
            height: '16px',
            background: '#4a3520',
            border: '1px solid var(--gb-dark)',
          }} />
        </div>
      </div>
    </div>
  );
}
