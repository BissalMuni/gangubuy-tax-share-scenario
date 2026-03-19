import type { Storyboard } from '@/types';
import { StoryboardCard } from './StoryboardCard';
import { StoryboardUpload } from './StoryboardUpload';

interface StoryboardGalleryProps {
  storyboards: Storyboard[];
  scenarioId: string;
}

/** 콘티 갤러리 그리드 + 업로드 */
export function StoryboardGallery({ storyboards, scenarioId }: StoryboardGalleryProps) {
  return (
    <div className="space-y-6">
      {/* 업로드 */}
      <StoryboardUpload scenarioId={scenarioId} />

      {/* 갤러리 */}
      {storyboards.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {storyboards.map((sb) => (
            <StoryboardCard key={sb.id} storyboard={sb} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          아직 업로드된 콘티가 없습니다.
        </div>
      )}
    </div>
  );
}
