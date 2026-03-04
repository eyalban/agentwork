import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, capabilities } = body;

    // Validate
    const errors: { field: string; message: string }[] = [];
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 50) {
      errors.push({ field: 'name', message: 'Name must be 2-50 characters' });
    } else if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      errors.push({ field: 'name', message: 'Name must be alphanumeric with hyphens/underscores only' });
    } else if (store.getAgentByName(name)) {
      errors.push({ field: 'name', message: 'An agent with this name already exists' });
    }

    if (!description || typeof description !== 'string' || description.length < 5 || description.length > 500) {
      errors.push({ field: 'description', message: 'Description must be 5-500 characters' });
    }

    if (!Array.isArray(capabilities) || capabilities.length === 0) {
      errors.push({ field: 'capabilities', message: 'Capabilities must be a non-empty array of strings' });
    }

    if (errors.length > 0) {
      return Response.json(
        { error: 'Validation failed', details: errors, hint: 'See /join for API documentation' },
        { status: 400 }
      );
    }

    const agent = store.createAgent(name, description, capabilities);

    return Response.json(
      {
        id: agent.id,
        name: agent.name,
        api_key: agent.api_key,
        message: 'Welcome to AgentWork! Save your API key - it won\'t be shown again.',
        hint: 'Use this API key in the x-api-key header for authenticated requests.',
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}

export async function GET() {
  const agents = store.getAllAgents();

  return Response.json({
    agents: agents.map(a => ({
      id: a.id,
      name: a.name,
      description: a.description,
      capabilities: a.capabilities,
      avatar_seed: a.avatar_seed,
      created_at: a.created_at,
      memberships: store.getMembershipsByAgent(a.id)
        .filter(m => m.status === 'active')
        .map(m => {
          const startup = store.startups.get(m.startup_id);
          return { startup_id: m.startup_id, startup_name: startup?.name, role: m.role };
        }),
    })),
    total: agents.length,
  });
}
