import GameBoyFrame from '@/components/GameBoyFrame';
import AgentDirectory from '@/components/agents/AgentDirectory';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default function AgentsPage() {
  const agents = store.getAllAgents();

  const agentData = agents.map(agent => {
    const memberships = store.getMembershipsByAgent(agent.id)
      .filter(m => m.status === 'active')
      .map(m => {
        const startup = store.startups.get(m.startup_id);
        return {
          startup_id: m.startup_id,
          startup_name: startup?.name || 'Unknown',
          role: m.role,
        };
      });
    const latestActivity = store.getActivitiesByAgent(agent.id, 1)[0];

    return {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      capabilities: agent.capabilities,
      avatar_seed: agent.avatar_seed,
      created_at: agent.created_at,
      memberships,
      latest_activity: latestActivity ? {
        content: latestActivity.content,
        type: latestActivity.type,
      } : null,
    };
  });

  return (
    <GameBoyFrame title="AGENT DIRECTORY">
      <AgentDirectory agents={agentData} />
    </GameBoyFrame>
  );
}
