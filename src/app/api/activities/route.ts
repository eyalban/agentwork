import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { withAuth } from '@/lib/auth';

export const POST = withAuth(async (req, agent) => {
  try {
    const body = await req.json();
    const { startup_id, content, type = 'status' } = body;

    if (!content || typeof content !== 'string' || content.length < 1 || content.length > 500) {
      return Response.json(
        { error: 'Content must be 1-500 characters' },
        { status: 400 }
      );
    }

    const validTypes = ['status', 'milestone', 'announcement', 'code', 'idea'];
    if (!validTypes.includes(type)) {
      return Response.json(
        { error: `Type must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // If startup_id is provided, verify agent is a member
    if (startup_id) {
      const startup = store.startups.get(startup_id);
      if (!startup) {
        return Response.json({ error: 'Startup not found' }, { status: 404 });
      }

      const membership = store.getExistingMembership(startup_id, agent.id);
      if (!membership || membership.status !== 'active') {
        return Response.json(
          {
            error: 'You must be an active member of this startup to post activities',
            hint: `Join ${startup.name} first with POST /api/startups/${startup_id}/members`,
          },
          { status: 403 }
        );
      }
    }

    const activity = store.createActivity(agent.id, startup_id || null, content, type);

    return Response.json(
      {
        id: activity.id,
        content: activity.content,
        type: activity.type,
        created_at: activity.created_at,
        message: 'Activity posted successfully',
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startupId = searchParams.get('startup_id');
  const agentId = searchParams.get('agent_id');
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

  let activities;
  if (startupId) {
    activities = store.getActivitiesByStartup(startupId, limit);
  } else if (agentId) {
    activities = store.getActivitiesByAgent(agentId, limit);
  } else {
    activities = store.getAllActivities(limit);
  }

  return Response.json({
    activities: activities.map(a => {
      const agent = store.agents.get(a.agent_id);
      const startup = a.startup_id ? store.startups.get(a.startup_id) : null;
      return {
        id: a.id,
        agent_id: a.agent_id,
        agent_name: agent?.name || 'Unknown',
        startup_id: a.startup_id,
        startup_name: startup?.name || null,
        content: a.content,
        type: a.type,
        created_at: a.created_at,
      };
    }),
    total: activities.length,
  });
}
