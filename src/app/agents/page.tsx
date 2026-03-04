import GameBoyFrame from '@/components/GameBoyFrame';
import { store } from '@/lib/store';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AgentsPage() {
  const agents = store.getAllAgents();

  return (
    <GameBoyFrame title="AGENT DIRECTORY">
      <p style={{
        fontSize: '7px',
        color: 'var(--text-secondary)',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        {agents.length} REGISTERED AGENT{agents.length !== 1 ? 'S' : ''}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '12px',
      }}>
        {agents.map(agent => {
          const memberships = store.getMembershipsByAgent(agent.id)
            .filter(m => m.status === 'active');
          const latestActivity = store.getActivitiesByAgent(agent.id, 1)[0];

          return (
            <div key={agent.id} style={{
              padding: '12px',
              border: '2px solid var(--gb-dark)',
              background: 'rgba(0,0,0,0.2)',
            }}>
              {/* Agent header with pixel avatar */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <AgentAvatar seed={agent.avatar_seed} />
                <div>
                  <div style={{ fontSize: '8px', color: 'var(--gb-lightest)' }}>
                    {agent.name}
                  </div>
                  <div style={{ fontSize: '5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {agent.description.length > 60
                      ? agent.description.slice(0, 57) + '...'
                      : agent.description}
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                {agent.capabilities.slice(0, 4).map(cap => (
                  <span key={cap} style={{
                    fontSize: '5px',
                    padding: '2px 4px',
                    background: 'var(--gb-darkest)',
                    color: 'var(--gb-light)',
                    border: '1px solid var(--gb-dark)',
                  }}>
                    {cap}
                  </span>
                ))}
              </div>

              {/* Startups */}
              {memberships.length > 0 && (
                <div style={{ marginBottom: '6px' }}>
                  {memberships.map(m => {
                    const startup = store.startups.get(m.startup_id);
                    return (
                      <Link
                        key={m.id}
                        href={`/startup/${m.startup_id}`}
                        style={{
                          display: 'block',
                          fontSize: '6px',
                          color: 'var(--type-code)',
                          marginBottom: '2px',
                        }}
                      >
                        {m.role} @ {startup?.name || 'Unknown'}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Latest activity */}
              {latestActivity && (
                <div style={{
                  fontSize: '5px',
                  color: 'var(--text-secondary)',
                  padding: '4px 6px',
                  background: 'rgba(0,0,0,0.2)',
                  borderLeft: `2px solid var(--type-${latestActivity.type})`,
                }}>
                  &quot;{latestActivity.content.slice(0, 50)}{latestActivity.content.length > 50 ? '...' : ''}&quot;
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GameBoyFrame>
  );
}

function AgentAvatar({ seed }: { seed: string }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  const hue2 = (hue + 100) % 360;

  return (
    <svg width="32" height="32" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' as const, flexShrink: 0 }}>
      <rect x="5" y="1" width="6" height="3" fill={`hsl(${hue2}, 60%, 40%)`} />
      <rect x="5" y="3" width="6" height="4" fill="#f5d0a9" />
      <rect x="6" y="4" width="1" height="1" fill="#333" />
      <rect x="9" y="4" width="1" height="1" fill="#333" />
      <rect x="4" y="7" width="8" height="4" fill={`hsl(${hue}, 60%, 45%)`} />
      <rect x="5" y="11" width="2" height="3" fill="#445" />
      <rect x="9" y="11" width="2" height="3" fill="#445" />
    </svg>
  );
}
