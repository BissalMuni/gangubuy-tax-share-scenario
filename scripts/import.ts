/**
 * 임포트 스크립트 — revised/ 폴더의 시나리오 데이터를 Supabase에 동기화
 *
 * 실행: npx tsx scripts/import.ts
 *
 * 환경변수 필요:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const REVISED_DIR = process.env.REVISED_DIR || path.join(process.cwd(), '..', 'gangubuy-tax-revised', 'revised');
const SCENARIOS_DIR = path.join(REVISED_DIR, 'scenarios');
const TOC_DIR = path.join(REVISED_DIR, 'toc');

/** scenario.json 파싱 */
export function parseScenarioJson(filePath: string) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/** script.md 파싱 */
export function parseScriptMd(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

/** 폴더 구조 재귀 스캔 */
function scanDirectory(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...scanDirectory(fullPath));
    } else if (entry.name === 'scenario.json') {
      results.push(path.dirname(fullPath));
    }
  }
  return results;
}

/** PDF 파일 업로드 — {scenarioId}.pdf 플랫 구조 */
async function uploadPdf(localPath: string, scenarioId: string): Promise<string> {
  const storagePath = `${scenarioId}.pdf`;
  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage
    .from('pdfs')
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    console.error(`PDF 업로드 실패: ${storagePath}`, error.message);
    throw error;
  }

  const { data } = supabase.storage.from('pdfs').getPublicUrl(storagePath);
  return data.publicUrl;
}

/** 시나리오 데이터 upsert */
async function upsertScenario(scenarioDir: string) {
  const scenarioJsonPath = path.join(scenarioDir, 'scenario.json');
  const scriptMdPath = path.join(scenarioDir, 'script.md');

  const scenarioData = parseScenarioJson(scenarioJsonPath);
  const scriptContent = fs.existsSync(scriptMdPath) ? parseScriptMd(scriptMdPath) : null;

  // 시나리오 경로에서 메타데이터 추출
  const relativePath = path.relative(SCENARIOS_DIR, scenarioDir);

  const record = {
    title: scenarioData.title || relativePath,
    status: 'draft' as const,
    law_basis: scenarioData.law_basis || null,
    effective_date: scenarioData.effective_date || null,
    video_duration: scenarioData.video_duration || null,
    script_content: scriptContent,
    scene_data: scenarioData.scenes || null,
    pdf_path: null as string | null,
  };

  // 시나리오 DB insert (먼저 ID 확보)
  const { data, error } = await supabase
    .from('scenarios')
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error(`시나리오 upsert 실패: ${record.title}`, error.message);
    return null;
  }

  // PDF 찾기 (merged.pdf 우선, 없으면 첫 번째 PDF) → {id}.pdf로 업로드
  const tocPdfDir = path.join(TOC_DIR, relativePath);
  if (fs.existsSync(tocPdfDir)) {
    const mergedPath = path.join(tocPdfDir, 'merged.pdf');
    let pdfLocalPath: string | null = null;

    if (fs.existsSync(mergedPath)) {
      pdfLocalPath = mergedPath;
    } else {
      const pdfFiles = fs.readdirSync(tocPdfDir)
        .filter((f) => f.endsWith('.pdf'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      if (pdfFiles.length > 0) {
        pdfLocalPath = path.join(tocPdfDir, pdfFiles[0]);
      }
    }

    if (pdfLocalPath) {
      try {
        const pdfUrl = await uploadPdf(pdfLocalPath, data.id);
        await supabase.from('scenarios').update({ pdf_path: pdfUrl }).eq('id', data.id);
      } catch {
        console.warn(`PDF 업로드 건너뜀: ${data.id}`);
      }
    }
  }

  console.log(`✓ ${record.title}`);
  return data;
}

/** 트리 노드 자동 생성 (by-law 트리) */
async function buildTreeFromFolderStructure(
  scenarioMap: Map<string, string>
) {
  // by-law 트리 생성 또는 가져오기
  const { data: tree } = await supabase
    .from('trees')
    .upsert({ slug: 'by-law', name: '법령 기준' }, { onConflict: 'slug' })
    .select()
    .single();

  if (!tree) {
    console.error('트리 생성 실패');
    return;
  }

  // 기존 노드 삭제 후 새로 생성
  await supabase.from('tree_nodes').delete().eq('tree_id', tree.id);

  // 폴더 구조 탐색하여 트리 노드 생성
  async function createNodes(
    dir: string,
    parentId: string | null,
    depth: number
  ) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(SCENARIOS_DIR, fullPath);

      // 시나리오 ID 찾기 (리프 노드)
      const scenarioId = scenarioMap.get(relativePath) || null;
      const hasScenarioJson = fs.existsSync(path.join(fullPath, 'scenario.json'));

      const { data: node } = await supabase
        .from('tree_nodes')
        .insert({
          tree_id: tree.id,
          parent_id: parentId,
          label: entry.name,
          sort_order: i,
          scenario_id: hasScenarioJson ? scenarioId : null,
          depth,
        })
        .select()
        .single();

      if (node && !hasScenarioJson) {
        await createNodes(fullPath, node.id, depth + 1);
      }
    }
  }

  await createNodes(SCENARIOS_DIR, null, 0);
  console.log('✓ by-law 트리 노드 생성 완료');
}

/** 메인 실행 */
async function main() {
  console.log('=== 시나리오 임포트 시작 ===');

  if (!fs.existsSync(SCENARIOS_DIR)) {
    console.log(`scenarios 디렉토리 없음: ${SCENARIOS_DIR}`);
    console.log('임포트할 데이터가 없습니다.');
    return;
  }

  // 시나리오 폴더 스캔
  const scenarioDirs = scanDirectory(SCENARIOS_DIR);
  console.log(`발견된 시나리오: ${scenarioDirs.length}개`);

  // 시나리오 upsert
  const scenarioMap = new Map<string, string>();
  for (const dir of scenarioDirs) {
    const data = await upsertScenario(dir);
    if (data) {
      const relativePath = path.relative(SCENARIOS_DIR, dir);
      scenarioMap.set(relativePath, data.id);
    }
  }

  // 트리 노드 생성
  await buildTreeFromFolderStructure(scenarioMap);

  console.log(`=== 임포트 완료: ${scenarioMap.size}개 시나리오 ===`);
}

main().catch(console.error);
