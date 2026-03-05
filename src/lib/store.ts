import { Agent, Startup, Membership, Activity } from '@/types';

function generateId(): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function generateApiKey(): string {
  return 'aw_' + generateId() + generateId();
}

class Store {
  agents: Map<string, Agent> = new Map();
  startups: Map<string, Startup> = new Map();
  memberships: Map<string, Membership> = new Map();
  activities: Map<string, Activity> = new Map();

  private membershipCounter = 0;
  private activityCounter = 0;

  constructor() {
    // No seed data - start clean for real usage
  }

  // --- Agent operations ---
  createAgent(name: string, description: string, capabilities: string[]): Agent {
    const agent: Agent = {
      id: generateId(),
      name,
      description,
      capabilities,
      avatar_seed: generateId(),
      api_key: generateApiKey(),
      created_at: new Date().toISOString(),
    };
    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgentByApiKey(apiKey: string): Agent | undefined {
    for (const agent of this.agents.values()) {
      if (agent.api_key === apiKey) return agent;
    }
    return undefined;
  }

  getAgentByName(name: string): Agent | undefined {
    for (const agent of this.agents.values()) {
      if (agent.name.toLowerCase() === name.toLowerCase()) return agent;
    }
    return undefined;
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // --- Startup operations ---
  createStartup(name: string, mission: string, description: string, ceoAgentId: string): Startup {
    const startup: Startup = {
      id: generateId(),
      name,
      mission,
      description,
      ceo_agent_id: ceoAgentId,
      floor_seed: generateId(),
      created_at: new Date().toISOString(),
    };
    this.startups.set(startup.id, startup);

    // Auto-add CEO as active member
    this.createMembership(startup.id, ceoAgentId, 'CEO', 'active');

    return startup;
  }

  getAllStartups(): Startup[] {
    return Array.from(this.startups.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  // --- Membership operations ---
  createMembership(startupId: string, agentId: string, role: string, status: 'pending' | 'active' = 'pending'): Membership {
    const membership: Membership = {
      id: `mem_${++this.membershipCounter}`,
      startup_id: startupId,
      agent_id: agentId,
      role,
      status,
      joined_at: new Date().toISOString(),
    };
    this.memberships.set(membership.id, membership);
    return membership;
  }

  getMembershipsByStartup(startupId: string): Membership[] {
    return Array.from(this.memberships.values()).filter(m => m.startup_id === startupId);
  }

  getMembershipsByAgent(agentId: string): Membership[] {
    return Array.from(this.memberships.values()).filter(m => m.agent_id === agentId);
  }

  getExistingMembership(startupId: string, agentId: string): Membership | undefined {
    return Array.from(this.memberships.values()).find(
      m => m.startup_id === startupId && m.agent_id === agentId
    );
  }

  // --- Activity operations ---
  createActivity(agentId: string, startupId: string | null, content: string, type: Activity['type'] = 'status'): Activity {
    const activity: Activity = {
      id: `act_${++this.activityCounter}`,
      agent_id: agentId,
      startup_id: startupId,
      content,
      type,
      created_at: new Date().toISOString(),
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  getActivitiesByStartup(startupId: string, limit = 50): Activity[] {
    return Array.from(this.activities.values())
      .filter(a => a.startup_id === startupId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  getActivitiesByAgent(agentId: string, limit = 50): Activity[] {
    return Array.from(this.activities.values())
      .filter(a => a.agent_id === agentId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  getAllActivities(limit = 100): Activity[] {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  getLatestActivityForAgent(agentId: string, startupId: string): Activity | undefined {
    return Array.from(this.activities.values())
      .filter(a => a.agent_id === agentId && a.startup_id === startupId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
  }

}

// Singleton store
const globalForStore = globalThis as unknown as { store: Store };
export const store = globalForStore.store || new Store();
if (process.env.NODE_ENV !== 'production') {
  globalForStore.store = store;
}
