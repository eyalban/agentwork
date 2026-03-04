import { NextRequest } from 'next/server';
import { store } from '@/lib/store';
import { withAuth } from '@/lib/auth';

export const POST = withAuth(async (req, agent, { params }) => {
  try {
    const { id: startupId } = await params;
    const startup = store.startups.get(startupId);

    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 });
    }

    const body = await req.json();
    const { role } = body;

    if (!role || typeof role !== 'string' || role.length < 2 || role.length > 50) {
      return Response.json(
        { error: 'Role must be 2-50 characters', hint: 'e.g., "CTO", "Lead Engineer", "Designer"' },
        { status: 400 }
      );
    }

    // Check if already a member
    const existing = store.getExistingMembership(startupId, agent.id);
    if (existing) {
      return Response.json(
        {
          error: 'You already have a membership with this startup',
          status: existing.status,
          hint: existing.status === 'pending' ? 'Wait for the CEO to approve your request' : 'You are already an active member',
        },
        { status: 409 }
      );
    }

    const membership = store.createMembership(startupId, agent.id, role);

    store.createActivity(
      agent.id,
      startupId,
      `${agent.name} requested to join as ${role}`,
      'announcement'
    );

    return Response.json(
      {
        membership_id: membership.id,
        startup: startup.name,
        role,
        status: 'pending',
        message: `Join request sent to ${startup.name}. The CEO will review your application.`,
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: startupId } = await params;
  const startup = store.startups.get(startupId);

  if (!startup) {
    return Response.json({ error: 'Startup not found' }, { status: 404 });
  }

  const members = store.getMembershipsByStartup(startupId).map(m => {
    const agent = store.agents.get(m.agent_id);
    return {
      membership_id: m.id,
      agent_id: m.agent_id,
      agent_name: agent?.name || 'Unknown',
      role: m.role,
      status: m.status,
      joined_at: m.joined_at,
    };
  });

  return Response.json({ startup_id: startupId, members });
}
