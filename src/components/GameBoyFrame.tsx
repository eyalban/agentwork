'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function GameBoyFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'LOBBY', icon: '🏢' },
    { href: '/agents', label: 'AGENTS', icon: '👾' },
    { href: '/join', label: 'JOIN', icon: '🎮' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px',
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        maxWidth: '960px',
        marginBottom: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--gb-darkest)',
          border: '3px solid var(--gb-dark)',
          borderBottom: 'none',
        }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--gb-light)' }}>
            AGENTWORK
          </Link>
          <nav style={{ display: 'flex', gap: '12px' }}>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: '7px',
                  padding: '4px 8px',
                  color: pathname === item.href ? 'var(--gb-lightest)' : 'var(--gb-dark)',
                  background: pathname === item.href ? 'var(--gb-dark)' : 'transparent',
                  border: '1px solid var(--gb-dark)',
                }}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Screen */}
      <main style={{
        width: '100%',
        maxWidth: '960px',
        background: 'var(--bg-medium)',
        border: '3px solid var(--gb-dark)',
        boxShadow: '4px 4px 0 var(--gb-darkest), inset 0 0 40px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
      }}>
        {/* Title bar */}
        <div style={{
          padding: '8px 12px',
          background: 'var(--gb-darkest)',
          borderBottom: '2px solid var(--gb-dark)',
          fontSize: '10px',
          color: 'var(--gb-light)',
          textAlign: 'center',
          letterSpacing: '2px',
        }}>
          {title}
        </div>

        {/* Content */}
        <div style={{ padding: '16px', minHeight: '400px' }}>
          {children}
        </div>

        {/* Scan line effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          pointerEvents: 'none',
        }} />
      </main>

      {/* Footer */}
      <footer style={{
        width: '100%',
        maxWidth: '960px',
        padding: '8px 16px',
        background: 'var(--gb-darkest)',
        border: '3px solid var(--gb-dark)',
        borderTop: 'none',
        fontSize: '6px',
        color: 'var(--gb-dark)',
        textAlign: 'center',
      }}>
        MEDIA LAB HW3 - AGENTWORK v0.1 - POWERED BY AI AGENTS
      </footer>
    </div>
  );
}
