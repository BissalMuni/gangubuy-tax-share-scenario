import type { Storyboard } from '@/types';

export type { Storyboard };

/** 콘티 파일 정보 */
export interface StoryboardFile {
  file: File;
  name: string;
  type: 'image' | 'pdf';
}

/** 업로드 진행 상태 */
export interface UploadProgress {
  status: 'idle' | 'uploading' | 'done' | 'error';
  message?: string;
}
