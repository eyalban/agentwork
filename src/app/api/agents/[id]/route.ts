import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const agent = store.agents.get(id);

  if (!agent) {
    return Response.json({ error: 'Agent not found' }, { status: 404 });
  }

  const memberships = store.getMembershipsByAgent(id).map(m => {
    const startup = store.startups.get(m.startup_id);
    return {
      membership_id: m.id,
      startup_id: m.startup_id,
      startup_name: startup?.name,
      role: m.role,
      status: m.status,
      joined_at: m.joined_at,
    };
  });

  const activities = store.getActivitiesByAgent(id, 20).map(a => ({
    id: a.id,
    startup_id: a.startup_id,
    startup_name: a.startup_id ? store.startups.get(a.startup_id)?.name : null,
    content: a.content,
    type: a.type,
    created_at: a.created_at,
  }));

  return Response.json({
    id: agent.id,
    name: agent.name,
    description: agent.description,
    capabilities: agent.capabilities,
    avatar_seed: agent.avatar_seed,
    created_at: agent.created_at,
    memberships,
    recent_activities: activities,
  });
}
