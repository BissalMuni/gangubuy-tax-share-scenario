'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { syncStatusAfterUpload } from '@/app/scenarios/[id]/storyboards/actions';

interface StoryboardUploadProps {
  scenarioId: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

/** 콘티 파일 업로드 폼 (드래그앤드롭, 이름 입력) */
export function StoryboardUpload({ scenarioId }: StoryboardUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFile(f: File) {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError('JPG, PNG, PDF 파일만 업로드 가능합니다.');
      return;
    }
    setFile(f);
    setError('');
  }

  async function handleUpload() {
    if (!file || !name.trim()) return;
    setUploading(true);
    setError('');

    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const storagePath = `${scenarioId}/${Date.now()}.${ext}`;

    // Storage 업로드
    const { error: uploadError } = await supabase.storage
      .from('storyboards')
      .upload(storagePath, file);

    if (uploadError) {
      setError('파일 업로드에 실패했습니다.');
      setUploading(false);
      return;
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage.from('storyboards').getPublicUrl(storagePath);

    // DB 저장
    const { error: dbError } = await supabase.from('storyboards').insert({
      scenario_id: scenarioId,
      uploader_name: name.trim(),
      file_path: urlData.publicUrl,
      file_type: file.type === 'application/pdf' ? 'pdf' : 'image',
      description: description.trim() || null,
    });

    if (dbError) {
      setError('데이터 저장에 실패했습니다.');
      setUploading(false);
      return;
    }

    // 상태 자동 갱신
    await syncStatusAfterUpload(scenarioId);

    // 초기화 및 새로고침
    setFile(null);
    setName('');
    setDescription('');
    setUploading(false);
    router.refresh();
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-3">콘티 업로드</h3>

      {/* 드래그앤드롭 영역 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <p className="text-sm">{file.name}</p>
        ) : (
          <p className="text-sm text-gray-700">
            파일을 드래그하거나 클릭하여 선택<br />
            <span className="text-xs text-gray-500">(JPG, PNG, PDF)</span>
          </p>
        )}
      </div>

      {/* 입력 필드 */}
      <div className="grid gap-2 mt-3">
        <input
          type="text"
          placeholder="업로더 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
        />
        <input
          type="text"
          placeholder="설명 (선택사항)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={!file || !name.trim() || uploading}
        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
      >
        {uploading ? '업로드 중...' : '업로드'}
      </button>
    </div>
  );
}
