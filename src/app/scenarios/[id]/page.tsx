import { notFound } from 'next/navigation';
import { fetchScenario } from '@/features/scenario/lib/scenario';
import { ScenarioPageHeader } from '@/features/scenario/components/ScenarioViewer';
import { ScriptDisplay } from '@/features/scenario/components/ScriptDisplay';
import { SceneList } from '@/features/scenario/components/SceneList';
import { PdfViewerLazy } from '@/features/scenario/components/PdfViewerLazy';

interface Props {
  params: Promise<{ id: string }>;
}

/** 시나리오 상세 페이지 */
export default async function ScenarioDetailPage({ params }: Props) {
  const { id } = await params;
  const scenario = await fetchScenario(id);

  if (!scenario) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ScenarioPageHeader scenario={scenario} activePage="detail" />
      <div className="w-[90%] mx-auto py-6 space-y-6">

        {/* 3열 레이아웃: PDF | 나레이션 스크립트 | 장면 구성 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF 뷰어 */}
          <div>
            {scenario.pdf_path ? (
              <PdfViewerLazy url={scenario.pdf_path} />
            ) : (
              <div className="border rounded-lg p-8 text-center text-gray-500 bg-gray-50">
                PDF 파일이 없습니다.
              </div>
            )}
          </div>
          {/* 나레이션 스크립트 */}
          <div>
            <ScriptDisplay content={scenario.script_content} />
          </div>
          {/* 장면 구성 */}
          <div>
            <SceneList scenes={scenario.scene_data} />
          </div>
        </div>
      </div>
    </div>
  );
}
