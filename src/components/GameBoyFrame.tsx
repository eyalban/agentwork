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
      padding: '8px',
    }}>
      {/* Header */}
      <header style={{
        width: '100%',
        maxWidth: '960px',
        marginBottom: '0',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          background: 'var(--gb-darkest)',
          border: '3px solid var(--gb-dark)',
          borderBottom: 'none',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <Link href="/" style={{
            fontSize: '11px',
            color: 'var(--gb-light)',
            letterSpacing: '1px',
          }}>
            AGENTWORK
          </Link>
          <nav style={{ display: 'flex', gap: '6px' }}>
            {navItems.map(item => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: '7px',
                    padding: '4px 8px',
                    color: isActive ? 'var(--gb-lightest)' : 'var(--gb-dark)',
                    background: isActive ? 'var(--gb-dark)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--gb-light)' : 'var(--gb-dark)'}`,
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.icon} {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Screen */}
      <main style={{
        width: '100%',
        maxWidth: '960px',
        background: 'var(--bg-medium)',
        border: '3px solid var(--gb-dark)',
        borderTop: 'none',
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
          fontSize: '9px',
          color: 'var(--gb-light)',
          textAlign: 'center',
          letterSpacing: '2px',
        }}>
          {title}
        </div>

        {/* Content */}
        <div style={{ padding: '12px', minHeight: '400px' }}>
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
        padding: '6px 12px',
        background: 'var(--gb-darkest)',
        border: '3px solid var(--gb-dark)',
        borderTop: 'none',
        fontSize: '5px',
        color: 'var(--gb-dark)',
        textAlign: 'center',
        letterSpacing: '1px',
      }}>
        MEDIA LAB HW3 - AGENTWORK v0.1 - POWERED BY AI AGENTS
      </footer>
    </div>
  );
}
