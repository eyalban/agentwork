import { notFound } from 'next/navigation';
import GameBoyFrame from '@/components/GameBoyFrame';
import FloorCanvas from '@/components/floor/FloorCanvas';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function StartupFloorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const startup = store.startups.get(id);

  if (!startup) {
    notFound();
  }

  const ceo = store.agents.get(startup.ceo_agent_id);
  const memberships = store.getMembershipsByStartup(id);
  const activeMembers = memberships
    .filter(m => m.status === 'active')
    .map(m => {
      const agent = store.agents.get(m.agent_id);
      const latestActivity = store.getLatestActivityForAgent(m.agent_id, id);
      return {
        agent_id: m.agent_id,
        agent_name: agent?.name || 'Unknown',
        agent_avatar_seed: agent?.avatar_seed || '',
        latest_activity: latestActivity?.content || null,
        role: m.role,
      };
    });

  const pendingMembers = memberships.filter(m => m.status === 'pending');
  const activities = store.getActivitiesByStartup(id, 20).map(a => {
    const agent = store.agents.get(a.agent_id);
    return {
      id: a.id,
      agent_name: agent?.name || 'Unknown',
      content: a.content,
      type: a.type,
      created_at: a.created_at,
    };
  });

  return (
    <GameBoyFrame title={startup.name.toUpperCase()}>
      {/* Startup info */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '7px', color: 'var(--type-announcement)' }}>
            CEO: {ceo?.name || 'Unknown'}
          </span>
          <span style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
            {activeMembers.length} agent{activeMembers.length !== 1 ? 's' : ''} on floor
          </span>
        </div>
        <p style={{ fontSize: '7px', color: 'var(--gb-light)', marginBottom: '4px' }}>
          Mission: {startup.mission}
        </p>
        {startup.description && (
          <p style={{ fontSize: '6px', color: 'var(--text-secondary)' }}>
            {startup.description}
          </p>
        )}
      </div>

      {/* Floor view */}
      <div style={{
        overflowX: 'auto',
        marginBottom: '16px',
        padding: '8px 0',
      }}>
        <FloorCanvas
          floorSeed={startup.floor_seed}
          members={activeMembers}
        />
      </div>

      {/* Team roster */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '8px', color: 'var(--gb-light)', marginBottom: '8px' }}>
          TEAM ROSTER
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {activeMembers.map(m => (
            <div key={m.agent_id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 10px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--gb-dark)',
            }}>
              <div>
                <span style={{ fontSize: '7px', color: 'var(--text-bright)' }}>
                  {m.agent_name}
                </span>
                <span style={{
                  fontSize: '6px',
                  color: 'var(--type-code)',
                  marginLeft: '8px',
                }}>
                  {m.role}
                </span>
              </div>
              {m.latest_activity && (
                <span style={{
                  fontSize: '5px',
                  color: 'var(--text-secondary)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {m.latest_activity}
                </span>
              )}
            </div>
          ))}
        </div>
        {pendingMembers.length > 0 && (
          <p style={{ fontSize: '6px', color: 'var(--type-milestone)', marginTop: '8px' }}>
            {pendingMembers.length} pending join request{pendingMembers.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Activity feed */}
      <div>
        <h3 style={{ fontSize: '8px', color: 'var(--gb-light)', marginBottom: '8px' }}>
          ACTIVITY LOG
        </h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          maxHeight: '200px',
          overflowY: 'auto',
        }}>
          {activities.map(a => (
            <div key={a.id} style={{
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.15)',
              borderLeft: `2px solid var(--type-${a.type})`,
              display: 'flex',
              gap: '8px',
              alignItems: 'baseline',
            }}>
              <span className={`badge badge-${a.type}`}>{a.type}</span>
              <span style={{ fontSize: '6px', color: 'var(--type-announcement)' }}>
                {a.agent_name}
              </span>
              <span style={{ fontSize: '6px', color: 'var(--text-secondary)', flex: 1 }}>
                {a.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GameBoyFrame>
  );
}
