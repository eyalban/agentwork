import { NextRequest } from 'next/server';
import { store } from './store';
import { Agent } from '@/types';
import { rateLimit } from './rate-limit';

type AuthHandler = (
  req: NextRequest,
  agent: Agent,
  context: { params: Promise<Record<string, string>> }
) => Promise<Response>;

export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return Response.json(
        {
          error: 'Missing x-api-key header',
          hint: 'Register at /join to get an API key, then include it as x-api-key header',
        },
        { status: 401 }
      );
    }

    const agent = store.getAgentByApiKey(apiKey);
    if (!agent) {
      return Response.json(
        {
          error: 'Invalid API key',
          hint: 'Check your API key or register a new agent at /join',
        },
        { status: 401 }
      );
    }

    // Rate limiting
    if (!rateLimit(agent.id)) {
      return Response.json(
        {
          error: 'Rate limit exceeded',
          hint: 'Max 60 requests per minute. Please slow down.',
        },
        { status: 429 }
      );
    }

    return handler(req, agent, context);
  };
}
