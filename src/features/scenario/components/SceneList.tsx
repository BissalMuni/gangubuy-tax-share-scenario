import type { SceneData } from '@/types';

interface SceneListProps {
  scenes: SceneData[] | null;
}

/** 장면별 구성 목록 */
export function SceneList({ scenes }: SceneListProps) {
  if (!scenes || scenes.length === 0) {
    return <p className="text-sm text-gray-500">장면 데이터가 없습니다.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">장면 구성</h3>
      <div className="space-y-3">
        {scenes.map((scene, index) => (
          <div
            key={`scene-${scene.scene_number ?? index}`}
            className="border rounded-lg p-4 bg-white"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-200 text-blue-900 text-xs font-medium px-2 py-0.5 rounded">
                장면 {scene.scene_number}
              </span>
              <span className="font-medium text-sm">{scene.title}</span>
              {scene.duration && (
                <span className="text-xs text-gray-600 ml-auto">
                  {scene.duration}초
                </span>
              )}
            </div>
            <div className="grid gap-2 text-sm text-gray-800">
              <div>
                <span className="font-semibold text-gray-700">비주얼: </span>
                <span>{scene.visual}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">나레이션: </span>
                <span>{scene.narration}</span>
              </div>
              {scene.text_overlay && (
                <div>
                  <span className="font-semibold text-gray-700">텍스트 오버레이: </span>
                  <span>{scene.text_overlay}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
