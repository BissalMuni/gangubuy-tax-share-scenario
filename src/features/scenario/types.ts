import type { Scenario, ScenarioRevision, SceneData } from '@/types';

/** 장면 데이터 (UI용) */
export type { SceneData };

/** 시나리오 + 수정 이력 */
export interface ScenarioWithRevisions extends Scenario {
  revisions: ScenarioRevision[];
}
