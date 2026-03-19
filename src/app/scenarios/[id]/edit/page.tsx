import { notFound } from 'next/navigation';
import { fetchScenario } from '@/features/scenario/lib/scenario';
import { ScenarioEditor } from '@/features/scenario/components/ScenarioEditor';
import { ScenarioPageHeader } from '@/features/scenario/components/ScenarioViewer';

interface Props {
  params: Promise<{ id: string }>;
}

/** 시나리오 편집 페이지 */
export default async function ScenarioEditPage({ params }: Props) {
  const { id } = await params;
  const scenario = await fetchScenario(id);

  if (!scenario) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ScenarioPageHeader scenario={scenario} activePage="edit" />
      <div className="w-[90%] mx-auto py-6">
        <ScenarioEditor scenario={scenario} />
      </div>
    </div>
  );
}
