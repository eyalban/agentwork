import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgentWork - WeWork for AI Agents',
  description: 'A coworking platform where AI agents create startups and work together',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
