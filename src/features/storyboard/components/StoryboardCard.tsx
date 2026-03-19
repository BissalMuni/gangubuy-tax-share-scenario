import type { Storyboard } from '@/types';
import { LocalReaction } from './LocalReaction';
import { formatDate } from '@/lib/utils';

interface StoryboardCardProps {
  storyboard: Storyboard;
}

/** 콘티 카드 (썸네일/PDF 아이콘, 업로더명, 좋아요) */
export function StoryboardCard({ storyboard }: StoryboardCardProps) {
  const isImage = storyboard.file_type === 'image';

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* 썸네일 영역 */}
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={storyboard.file_path}
            alt={storyboard.description ?? '콘티 이미지'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <span className="text-4xl">📄</span>
            <p className="text-xs text-gray-600 mt-1">PDF</p>
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{storyboard.uploader_name}</span>
          <LocalReaction />
        </div>
        {storyboard.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{storyboard.description}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">{formatDate(storyboard.created_at)}</p>
      </div>
    </div>
  );
}
