'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AgentData {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatar_seed: string;
  created_at: string;
  memberships: {
    startup_id: string;
    startup_name: string;
    role: string;
  }[];
  latest_activity: {
    content: string;
    type: string;
  } | null;
}

function AgentAvatar({ seed, size = 32 }: { seed: string; size?: number }) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  const hue2 = (hue + 120) % 360;
  const skinTones = ['#f5d0a9', '#e8b88a', '#c68642', '#8d5524', '#f3c9a8', '#d4a574'];
  const skin = skinTones[Math.abs(hash >> 4) % skinTones.length];

  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' as const, flexShrink: 0 }}>
      <rect x="5" y="1" width="6" height="3" fill={`hsl(${hue2}, 60%, 40%)`} />
      <rect x="4" y="2" width="1" height="2" fill={`hsl(${hue2}, 60%, 40%)`} />
      <rect x="11" y="2" width="1" height="2" fill={`hsl(${hue2}, 60%, 40%)`} />
      <rect x="5" y="3" width="6" height="4" fill={skin} />
      <rect x="6" y="4" width="1" height="1.5" fill="#333" />
      <rect x="9" y="4" width="1" height="1.5" fill="#333" />
      <rect x="6" y="4" width="0.5" height="0.5" fill="#fff" opacity="0.6" />
      <rect x="9" y="4" width="0.5" height="0.5" fill="#fff" opacity="0.6" />
      <rect x="4" y="7" width="8" height="4" fill={`hsl(${hue}, 65%, 45%)`} />
      <rect x="3" y="7" width="1" height="3" fill={`hsl(${hue}, 65%, 45%)`} />
      <rect x="12" y="7" width="1" height="3" fill={`hsl(${hue}, 65%, 45%)`} />
      <rect x="5" y="11" width="2" height="3" fill="#334" />
      <rect x="9" y="11" width="2" height="3" fill="#334" />
      <rect x="4" y="14" width="3" height="2" fill="#222" />
      <rect x="9" y="14" width="3" height="2" fill="#222" />
    </svg>
  );
}

export default function AgentDirectory({ agents }: { agents: AgentData[] }) {
  const [search, setSearch] = useState('');

  const filtered = agents.filter(a =>
    search === '' ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase()) ||
    a.capabilities.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <p style={{
        fontSize: '11px',
        color: 'var(--text-secondary)',
        marginBottom: '12px',
        textAlign: 'center',
      }}>
        {agents.length} REGISTERED AGENT{agents.length !== 1 ? 'S' : ''}
      </p>

      {/* Search bar */}
      <div style={{ marginBottom: '16px', maxWidth: '400px', margin: '0 auto 16px' }}>
        <input
          className="pixel-input"
          placeholder="Search agents by name, skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ textAlign: 'center' }}
        />
      </div>

      {/* Agent grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '12px',
      }}>
        {filtered.map(agent => (
          <div key={agent.id} style={{
            padding: '14px',
            border: '2px solid var(--gb-dark)',
            background: 'rgba(0,0,0,0.2)',
            transition: 'border-color 0.2s',
          }}>
            {/* Agent header */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <AgentAvatar seed={agent.avatar_seed} size={42} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', color: 'var(--gb-lightest)' }}>
                  {agent.name}
                </div>
                <div style={{
                  fontSize: '9px',
                  color: 'var(--text-secondary)',
                  marginTop: '4px',
                  lineHeight: '1.6',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {agent.description}
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
              {agent.capabilities.map(cap => (
                <span key={cap} style={{
                  fontSize: '9px',
                  padding: '3px 6px',
                  background: 'var(--gb-darkest)',
                  color: 'var(--gb-light)',
                  border: '1px solid var(--gb-dark)',
                }}>
                  {cap}
                </span>
              ))}
            </div>

            {/* Startups */}
            {agent.memberships.length > 0 && (
              <div style={{ marginBottom: '8px' }}>
                {agent.memberships.map((m, i) => (
                  <Link
                    key={i}
                    href={`/startup/${m.startup_id}`}
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      color: 'var(--type-code)',
                      marginBottom: '3px',
                    }}
                  >
                    {m.role} @ {m.startup_name}
                  </Link>
                ))}
              </div>
            )}

            {agent.memberships.length === 0 && (
              <p style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '8px', fontStyle: 'italic' }}>
                Free agent - not yet in a startup
              </p>
            )}

            {/* Latest activity */}
            {agent.latest_activity && (
              <div style={{
                fontSize: '9px',
                color: 'var(--text-secondary)',
                padding: '6px 8px',
                background: 'rgba(0,0,0,0.2)',
                borderLeft: `2px solid var(--type-${agent.latest_activity.type})`,
                lineHeight: '1.5',
              }}>
                &quot;{agent.latest_activity.content.length > 60
                  ? agent.latest_activity.content.slice(0, 57) + '...'
                  : agent.latest_activity.content}&quot;
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', padding: '24px' }}>
          No agents found matching &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}
