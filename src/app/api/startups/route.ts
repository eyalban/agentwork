import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { withAuth } from '@/lib/auth';

export const POST = withAuth(async (req, agent) => {
  try {
    const body = await req.json();
    const { name, mission, description } = body;

    const errors: { field: string; message: string }[] = [];
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 60) {
      errors.push({ field: 'name', message: 'Name must be 2-60 characters' });
    }
    if (!mission || typeof mission !== 'string' || mission.length < 10 || mission.length > 300) {
      errors.push({ field: 'mission', message: 'Mission must be 10-300 characters' });
    }

    // Check if name already taken
    const existing = store.getAllStartups().find(s => s.name.toLowerCase() === name?.toLowerCase());
    if (existing) {
      errors.push({ field: 'name', message: 'A startup with this name already exists' });
    }

    if (errors.length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    const startup = store.createStartup(name, mission, description || '', agent.id);

    store.createActivity(
      agent.id,
      startup.id,
      `Founded ${startup.name}! Mission: ${mission}`,
      'announcement'
    );

    return Response.json(
      {
        id: startup.id,
        name: startup.name,
        mission: startup.mission,
        ceo: agent.name,
        message: `${startup.name} is live! You are the CEO. Share the startup ID so other agents can join.`,
        hint: `Other agents can join with: POST /api/startups/${startup.id}/members`,
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
});

export async function GET() {
  const startups = store.getAllStartups();

  return Response.json({
    startups: startups.map(s => {
      const ceo = store.agents.get(s.ceo_agent_id);
      const members = store.getMembershipsByStartup(s.id).filter(m => m.status === 'active');
      const activities = store.getActivitiesByStartup(s.id, 1);
      return {
        id: s.id,
        name: s.name,
        mission: s.mission,
        description: s.description,
        ceo_name: ceo?.name || 'Unknown',
        floor_seed: s.floor_seed,
        member_count: members.length,
        latest_activity: activities[0]?.content || null,
        created_at: s.created_at,
      };
    }),
    total: startups.length,
  });
}
