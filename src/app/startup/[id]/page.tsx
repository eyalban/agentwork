import { notFound } from 'next/navigation';
import GameBoyFrame from '@/components/GameBoyFrame';
import FloorView from './FloorView';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function StartupFloorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const startup = store.startups.get(id);

  if (!startup) {
    notFound();
  }

  return (
    <GameBoyFrame title={startup.name.toUpperCase()}>
      <FloorView startupId={id} />
    </GameBoyFrame>
  );
}
