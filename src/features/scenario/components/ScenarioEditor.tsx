'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { Scenario, SceneData } from '@/types';
import { updateScenario } from '@/app/scenarios/[id]/edit/actions';

// 마크다운 에디터 동적 로드
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface ScenarioEditorProps {
  scenario: Scenario;
}

/** 시나리오 편집 폼 */
export function ScenarioEditor({ scenario }: ScenarioEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(scenario.title);
  const [lawBasis, setLawBasis] = useState(scenario.law_basis ?? '');
  const [effectiveDate, setEffectiveDate] = useState(scenario.effective_date ?? '');
  const [videoDuration, setVideoDuration] = useState(scenario.video_duration?.toString() ?? '');
  const [scriptContent, setScriptContent] = useState(scenario.script_content ?? '');
  const [scenes, setScenes] = useState<SceneData[]>(scenario.scene_data ?? []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave() {
    setSaving(true);
    setMessage('');

    const result = await updateScenario({
      id: scenario.id,
      title,
      law_basis: lawBasis || null,
      effective_date: effectiveDate || null,
      video_duration: videoDuration ? parseInt(videoDuration) : null,
      script_content: scriptContent || null,
      scene_data: scenes.length > 0 ? scenes : null,
    });

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage('저장되었습니다.');
      setTimeout(() => router.push(`/scenarios/${scenario.id}`), 1000);
    }
    setSaving(false);
  }

  /** 장면 필드 수정 */
  function updateScene(index: number, field: keyof SceneData, value: string | number) {
    setScenes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  /** 장면 추가 */
  function addScene() {
    setScenes((prev) => [
      ...prev,
      {
        scene_number: prev.length + 1,
        title: '',
        visual: '',
        narration: '',
        text_overlay: '',
        duration: 0,
      },
    ]);
  }

  /** 장면 삭제 */
  function removeScene(index: number) {
    setScenes((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, scene_number: i + 1 })));
  }

  return (
    <div className="space-y-6">
      {/* 메타정보 */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-gray-800 placeholder:text-gray-400"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">법률근거</label>
            <input
              type="text"
              value={lawBasis}
              onChange={(e) => setLawBasis(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">시행일</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">영상길이(초)</label>
            <input
              type="number"
              value={videoDuration}
              onChange={(e) => setVideoDuration(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-800 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* 나레이션 스크립트 + 장면 구성 (2열 배치) */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* 왼쪽: 나레이션 스크립트 */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">나레이션 스크립트</label>
          <MDEditor
            value={scriptContent}
            onChange={(val) => setScriptContent(val ?? '')}
            height="100%"
            visibleDragbar={false}
          />
        </div>

        {/* 오른쪽: 장면 구성 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-semibold text-gray-900">장면 구성</label>
            <button
              onClick={addScene}
              className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              + 장면 추가
            </button>
          </div>
          <div className="space-y-4">
            {scenes.map((scene, i) => (
              <div key={i} className="border rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-blue-900">장면 {scene.scene_number}</span>
                  <button
                    onClick={() => removeScene(i)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    삭제
                  </button>
                </div>
                <div className="grid gap-2">
                  <input
                    placeholder="장면 제목"
                    value={scene.title}
                    onChange={(e) => updateScene(i, 'title', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                  <textarea
                    placeholder="비주얼"
                    value={scene.visual}
                    onChange={(e) => updateScene(i, 'visual', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400"
                    rows={2}
                  />
                  <textarea
                    placeholder="나레이션"
                    value={scene.narration}
                    onChange={(e) => updateScene(i, 'narration', e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="텍스트 오버레이"
                      value={scene.text_overlay ?? ''}
                      onChange={(e) => updateScene(i, 'text_overlay', e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                    <input
                      type="number"
                      placeholder="시간(초)"
                      value={scene.duration ?? ''}
                      onChange={(e) => updateScene(i, 'duration', parseInt(e.target.value) || 0)}
                      className="w-full border rounded px-2 py-1 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? '저장 중...' : '저장'}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border rounded-md hover:bg-gray-50"
        >
          취소
        </button>
        {message && (
          <span className={`text-sm ${message.includes('실패') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
