import type { Scenario } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ScriptDisplay } from './ScriptDisplay';
import { SceneList } from './SceneList';
import { formatDate, formatDuration } from '@/lib/utils';
import Link from 'next/link';

interface ScenarioViewerProps {
  scenario: Scenario;
}

interface ScenarioPageHeaderProps {
  scenario: Scenario;
  activePage: 'detail' | 'edit' | 'storyboards';
}

/** 시나리오 페이지 공통 헤더 (브레드크럼 + 제목 + 탭 + 돌아가기) */
export function ScenarioPageHeader({ scenario, activePage }: ScenarioPageHeaderProps) {
  const colorMap: Record<string, { active: string; inactive: string }> = {
    list: {
      active: 'bg-gray-800 text-white',
      inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    },
    detail: {
      active: 'bg-blue-600 text-white',
      inactive: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
    edit: {
      active: 'bg-emerald-600 text-white',
      inactive: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    },
    storyboards: {
      active: 'bg-purple-600 text-white',
      inactive: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    },
  };

  const tabStyle = (page: string) => {
    const colors = colorMap[page] ?? colorMap.detail;
    const isActive = page === activePage;
    return `px-4 py-2 text-sm font-medium rounded-md ${isActive ? colors.active : colors.inactive}`;
  };

  return (
    <header className="border-b px-6 py-4 space-y-4">
      {/* 브레드크럼 + 돌아가기 */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/scenarios" className="hover:text-blue-600">시나리오 목록</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{scenario.title}</span>
        </nav>
        <Link
          href="/scenarios"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          돌아가기
        </Link>
      </div>

      {/* 제목 + 메타정보 + 탭 버튼 */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{scenario.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-700">
            <StatusBadge status={scenario.status} />
            {scenario.law_basis && <span>법률근거: {scenario.law_basis}</span>}
            {scenario.effective_date && (
              <span>시행일: {formatDate(scenario.effective_date)}</span>
            )}
            {scenario.video_duration && (
              <span>영상길이: {formatDuration(scenario.video_duration)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/scenarios" className={tabStyle('list')}>
            목록
          </Link>
          <Link href={`/scenarios/${scenario.id}`} className={tabStyle('detail')}>
            초안
          </Link>
          <Link href={`/scenarios/${scenario.id}/edit`} className={tabStyle('edit')}>
            수정
          </Link>
          <Link href={`/scenarios/${scenario.id}/storyboards`} className={tabStyle('storyboards')}>
            콘티
          </Link>
        </div>
      </div>
    </header>
  );
}

/** @deprecated ScenarioHeader 대신 ScenarioPageHeader 사용 */
export function ScenarioHeader({ scenario }: ScenarioViewerProps) {
  return <ScenarioPageHeader scenario={scenario} activePage="detail" />;
}

/** 시나리오 상세 뷰어 (하위호환용) */
export function ScenarioViewer({ scenario }: ScenarioViewerProps) {
  return (
    <div className="space-y-6">
      <ScenarioHeader scenario={scenario} />
      <ScriptDisplay content={scenario.script_content} />
      <SceneList scenes={scenario.scene_data} />
    </div>
  );
}
