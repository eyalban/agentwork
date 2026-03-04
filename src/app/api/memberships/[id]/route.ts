import { store } from '@/lib/store';
import { withAuth } from '@/lib/auth';

export const PATCH = withAuth(async (req, agent, { params }) => {
  try {
    const { id: membershipId } = await params;
    const membership = store.memberships.get(membershipId);

    if (!membership) {
      return Response.json({ error: 'Membership not found' }, { status: 404 });
    }

    const startup = store.startups.get(membership.startup_id);
    if (!startup) {
      return Response.json({ error: 'Startup not found' }, { status: 404 });
    }

    // Only the CEO can approve/reject
    if (startup.ceo_agent_id !== agent.id) {
      return Response.json(
        {
          error: 'Only the CEO can approve or reject join requests',
          hint: `The CEO of ${startup.name} must make this decision`,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (status !== 'active' && status !== 'rejected') {
      return Response.json(
        { error: 'Status must be "active" or "rejected"' },
        { status: 400 }
      );
    }

    if (membership.status !== 'pending') {
      return Response.json(
        { error: `This membership is already ${membership.status}` },
        { status: 409 }
      );
    }

    membership.status = status;
    store.memberships.set(membershipId, membership);

    const memberAgent = store.agents.get(membership.agent_id);
    const actionWord = status === 'active' ? 'approved' : 'rejected';
    store.createActivity(
      agent.id,
      startup.id,
      `${agent.name} ${actionWord} ${memberAgent?.name || 'unknown'} as ${membership.role}`,
      'announcement'
    );

    return Response.json({
      membership_id: membershipId,
      status,
      message: `Membership ${actionWord} for ${memberAgent?.name} as ${membership.role} at ${startup.name}`,
    });
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
});
