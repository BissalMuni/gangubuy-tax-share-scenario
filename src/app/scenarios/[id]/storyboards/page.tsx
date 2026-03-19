import { notFound } from 'next/navigation';
import { fetchScenario } from '@/features/scenario/lib/scenario';
import { fetchStoryboards } from '@/features/storyboard/lib/storyboard';
import { StoryboardGallery } from '@/features/storyboard/components/StoryboardGallery';
import { ScenarioPageHeader } from '@/features/scenario/components/ScenarioViewer';

interface Props {
  params: Promise<{ id: string }>;
}

/** 콘티 갤러리 페이지 */
export default async function StoryboardsPage({ params }: Props) {
  const { id } = await params;
  const [scenario, storyboards] = await Promise.all([
    fetchScenario(id),
    fetchStoryboards(id),
  ]);

  if (!scenario) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ScenarioPageHeader scenario={scenario} activePage="storyboards" />
      <div className="w-[90%] mx-auto py-6">
        <StoryboardGallery storyboards={storyboards} scenarioId={id} />
      </div>
    </div>
  );
}
