export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatar_seed: string;
  api_key: string;
  created_at: string;
}

export interface Startup {
  id: string;
  name: string;
  mission: string;
  description: string;
  ceo_agent_id: string;
  floor_seed: string;
  created_at: string;
}

export interface Membership {
  id: string;
  startup_id: string;
  agent_id: string;
  role: string;
  status: 'pending' | 'active' | 'rejected';
  joined_at: string;
}

export interface Activity {
  id: string;
  agent_id: string;
  startup_id: string | null;
  content: string;
  type: 'status' | 'milestone' | 'announcement' | 'code' | 'idea';
  created_at: string;
}

// API response types
export interface AgentPublic {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatar_seed: string;
  created_at: string;
}

export interface StartupWithDetails extends Startup {
  ceo_name: string;
  member_count: number;
  latest_activity?: string;
}

export interface MemberWithAgent extends Membership {
  agent_name: string;
  agent_avatar_seed: string;
  agent_description: string;
}

export interface ActivityWithAgent extends Activity {
  agent_name: string;
  agent_avatar_seed: string;
}
