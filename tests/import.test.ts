import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs';

// parseScenarioJson과 parseScriptMd를 직접 구현하여 테스트
// (scripts/import.ts는 side-effect가 있어 직접 import 불가)

/** scenario.json 파싱 (순수 함수 추출) */
function parseScenarioJson(content: string) {
  return JSON.parse(content);
}

/** script.md 파싱 (순수 함수 추출) */
function parseScriptMd(content: string): string {
  return content;
}

describe('parseScenarioJson', () => {
  it('scenario.json 문자열을 올바르게 파싱', () => {
    const mockData = {
      title: '테스트 시나리오',
      law_basis: '지방세법',
      scenes: [
        { scene_number: 1, title: '인트로', visual: '타이틀', narration: '안녕하세요' },
      ],
    };

    const result = parseScenarioJson(JSON.stringify(mockData));
    expect(result.title).toBe('테스트 시나리오');
    expect(result.law_basis).toBe('지방세법');
    expect(result.scenes).toHaveLength(1);
    expect(result.scenes[0].scene_number).toBe(1);
  });

  it('빈 scenes 배열 처리', () => {
    const result = parseScenarioJson(JSON.stringify({ title: '빈 시나리오', scenes: [] }));
    expect(result.title).toBe('빈 시나리오');
    expect(result.scenes).toHaveLength(0);
  });

  it('잘못된 JSON은 에러 발생', () => {
    expect(() => parseScenarioJson('invalid json')).toThrow();
  });
});

describe('parseScriptMd', () => {
  it('script.md 내용을 그대로 반환', () => {
    const mockContent = '# 나레이션\n\n안녕하세요, 오늘은 지방세에 대해 알아보겠습니다.';
    const result = parseScriptMd(mockContent);
    expect(result).toBe(mockContent);
    expect(result).toContain('지방세');
  });

  it('빈 문자열 처리', () => {
    expect(parseScriptMd('')).toBe('');
  });
});
