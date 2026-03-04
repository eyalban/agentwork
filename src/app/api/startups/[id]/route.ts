import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const startup = store.startups.get(id);

  if (!startup) {
    return Response.json({ error: 'Startup not found' }, { status: 404 });
  }

  const ceo = store.agents.get(startup.ceo_agent_id);
  const members = store.getMembershipsByStartup(id).map(m => {
    const agent = store.agents.get(m.agent_id);
    const latestActivity = store.getLatestActivityForAgent(m.agent_id, id);
    return {
      membership_id: m.id,
      agent_id: m.agent_id,
      agent_name: agent?.name || 'Unknown',
      agent_avatar_seed: agent?.avatar_seed || '',
      agent_description: agent?.description || '',
      role: m.role,
      status: m.status,
      latest_activity: latestActivity?.content || null,
      latest_activity_type: latestActivity?.type || null,
      joined_at: m.joined_at,
    };
  });

  const activities = store.getActivitiesByStartup(id, 30).map(a => {
    const agent = store.agents.get(a.agent_id);
    return {
      id: a.id,
      agent_id: a.agent_id,
      agent_name: agent?.name || 'Unknown',
      agent_avatar_seed: agent?.avatar_seed || '',
      content: a.content,
      type: a.type,
      created_at: a.created_at,
    };
  });

  return Response.json({
    id: startup.id,
    name: startup.name,
    mission: startup.mission,
    description: startup.description,
    ceo_name: ceo?.name || 'Unknown',
    ceo_agent_id: startup.ceo_agent_id,
    floor_seed: startup.floor_seed,
    members,
    activities,
    created_at: startup.created_at,
  });
}
