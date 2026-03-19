/**
 * 한글 폴더명 → 영문 Storage 경로 매핑 생성기
 *
 * 한글 폴더 구조는 유지하고, Supabase Storage용 영문 경로를 별도 JSON으로 생성한다.
 * 매핑 규칙:
 * - Level 1 (법령): 그대로 유지 (이미 영문)
 * - Level 2 (세목): 로마숫자 → 아라비아숫자, 한글 → 영문 슬러그
 * - Level 3 (법률근거): 한글 → 영문 슬러그
 * - Level 4 (시나리오): 번호 접두사만 사용
 */

import * as fs from 'fs';
import * as path from 'path';

/** 세목(Level 2) 한글 → 영문 매핑 */
const TAX_CATEGORY_MAP: Record<string, string> = {
  'Ⅰ_취득세': '1-acquisition-tax',
  'Ⅱ_등록면허세_등록분': '2-registration-tax',
  'Ⅱ_재산세': '2-property-tax',
  'Ⅲ_등록면허세_면허분': '3-license-tax',
  'Ⅳ_담배소비세': '4-tobacco-tax',
  'Ⅴ_지방소비세': '5-local-consumption-tax',
  'Ⅵ_주민세': '6-resident-tax',
  'Ⅶ_지방소득세': '7-local-income-tax',
  'Ⅷ_재산세': '8-property-tax',
  'Ⅸ_자동차세': '9-vehicle-tax',
  'Ⅹ_지역자원시설세': '10-regional-resource-tax',
  // localtax-special-law1
  'Ⅰ_2025년_지방세_지출_재설계_현황': '1-tax-expenditure-redesign',
  'Ⅱ_지방세특례제한법령_개정_내용': '2-special-tax-law-amendments',
  'Ⅲ_참고자료': '3-reference',
};

/** 법률근거(Level 3) 한글 → 영문 매핑 */
const LAW_BASIS_MAP: Record<string, string> = {
  '지방세법': 'law',
  '지방세법_시행령': 'enforcement-decree',
  '지방세법_시행규칙': 'enforcement-rule',
  '지방세법_시행령_규칙': 'decree-and-rule',
  '지방세법령': 'law-and-decree',
  '조례': 'ordinance',
  '개요': 'overview',
  '개정내용': 'amendments',
  '참고': 'reference',
};

export interface PathMapping {
  /** 원본 한글 경로 (폴더 구조 기준) */
  koreanPath: string;
  /** 영문 Storage 경로 */
  englishPath: string;
  /** 각 레벨별 매핑 정보 */
  segments: {
    korean: string;
    english: string;
    level: number;
  }[];
}

/** 폴더명에서 번호 접두사 추출 */
function extractNumber(name: string): string {
  const match = name.match(/^(\d+)/);
  return match ? match[1] : name;
}

/** 단일 폴더명을 영문으로 변환 */
function translateSegment(name: string, level: number): string {
  if (level === 0) return name; // 법령 (이미 영문)
  if (level === 1) return TAX_CATEGORY_MAP[name] || name;
  if (level === 2) return LAW_BASIS_MAP[name] || name;
  if (level === 3) return extractNumber(name); // 시나리오 번호만
  return name;
}

/** 전체 경로를 영문으로 변환 */
export function translatePath(koreanPath: string): PathMapping {
  const parts = koreanPath.split(/[/\\]/);
  const segments = parts.map((part, i) => ({
    korean: part,
    english: translateSegment(part, i),
    level: i,
  }));

  return {
    koreanPath,
    englishPath: segments.map((s) => s.english).join('/'),
    segments,
  };
}

/** 매핑 JSON 파일 생성 */
function generateMappingFile(scenariosDir: string, outputPath: string) {
  const mappings: Record<string, PathMapping> = {};

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(scenariosDir, fullPath);
      const hasScenario = fs.existsSync(path.join(fullPath, 'scenario.json'));

      const mapping = translatePath(relativePath);
      mappings[relativePath] = mapping;

      if (!hasScenario) {
        scan(fullPath);
      }
    }
  }

  scan(scenariosDir);

  fs.writeFileSync(outputPath, JSON.stringify(mappings, null, 2), 'utf-8');
  console.log(`매핑 파일 생성: ${outputPath} (${Object.keys(mappings).length}개 경로)`);

  return mappings;
}

// CLI 실행
if (require.main === module) {
  const REVISED_DIR = process.env.REVISED_DIR || path.join(process.cwd(), '..', 'gangubuy-tax-revised', 'revised');
  const SCENARIOS_DIR = path.join(REVISED_DIR, 'scenarios');
  const OUTPUT_PATH = path.join(process.cwd(), 'scripts', 'path-mapping.json');

  generateMappingFile(SCENARIOS_DIR, OUTPUT_PATH);
}
