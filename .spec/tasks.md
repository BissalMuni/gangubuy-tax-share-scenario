# Tasks

## Project: share-scenario

총 **62개 태스크** | 10 Phase

---

## Phase 1: Setup — 기반 설정

- [x] [T001] pnpm runtime 의존성 설치: `@supabase/supabase-js @supabase/ssr zustand react-pdf @uiw/react-md-editor`
- [x] [T002] pnpm dev 의존성 설치: `vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event jsdom`
- [x] [T003] `.env.local.example` 환경변수 템플릿 생성 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_PASSWORD`, `ADMIN_PASSWORD`)
- [x] [T004] `supabase/migrations/001_initial_schema.sql` DB 스키마 마이그레이션 파일 생성 (trees, tree_nodes, scenarios, scenario_revisions, storyboards + updated_at 트리거)
- [x] [T005] `supabase/migrations/002_rls_policies.sql` RLS 정책 파일 생성 (전체 허용 정책 + Storage 버킷 생성)
- [x] [T006] `src/lib/supabase/client.ts` 브라우저 Supabase 클라이언트 (싱글톤)
- [x] [T007] `src/lib/supabase/server.ts` 서버 Supabase 클라이언트 (Server Components/Actions용)
- [x] [T008] `src/lib/supabase/types.ts` Supabase DB 테이블 타입 (Database 인터페이스)
- [x] [T009] `src/types/index.ts` 공유 도메인 타입 정의 (Scenario, ScenarioStatus, SceneData, Tree, TreeNode, Storyboard, ScenarioRevision)
- [x] [T010] `vitest.config.ts` vitest 설정 (jsdom environment, path alias `@/*`)
- [x] [T011] `src/app/layout.tsx` 메타데이터 업데이트 + `lang="ko"` 설정

---

## Phase 2: Auth — 사이트 인증 (US-8)

- [x] [T012] `src/app/api/auth/login/route.ts` 사이트 비밀번호 인증 API — `SITE_PASSWORD` 검증, `site_auth` 쿠키 설정 (7일, HttpOnly)
- [x] [T013] `src/app/login/page.tsx` 로그인 페이지 — 비밀번호 입력 폼, 인증 성공 시 /dashboard 리다이렉트
- [x] [T014] `middleware.ts` 사이트 전체 보호 — `site_auth` 쿠키 검증, 미인증 시 /login 리다이렉트 (로그인·인증 API·정적 파일 제외)

---

## Phase 3: Core — 트리 네비게이션 (US-1)

- [x] [T015] `src/features/tree/types.ts` 트리 관련 타입 (TreeWithNodes, NestedTreeNode)
- [x] [T016] `src/features/tree/lib/tree.ts` DB에서 trees 목록 조회, tree_nodes를 중첩 트리 구조로 변환하는 함수 (flatToNested)
- [x] [T017] `src/features/tree/hooks/useTreeState.ts` Zustand 스토어 — 선택된 트리 slug, 펼친 노드 ID 집합
- [x] [T018] `src/features/tree/components/TreeSelector.tsx` 분류 기준 드롭다운 `'use client'`
- [x] [T019] `src/features/tree/components/TreeNodeItem.tsx` 개별 노드 (접기/펼치기, 상태 배지 표시) `'use client'`
- [x] [T020] `src/features/tree/components/TreeNav.tsx` 전체 트리 네비게이션 (TreeSelector + 중첩 TreeNode 목록) `'use client'`
- [x] [T021] `src/app/scenarios/page.tsx` 시나리오 목록 페이지 — 서버에서 trees 패칭 후 TreeNav에 전달

---

## Phase 4: Core — 시나리오 뷰어 (US-2)

- [x] [T022] `src/features/scenario/lib/scenario.ts` 시나리오 단건·전체 조회 함수 (fetchScenario, fetchAllScenarios, fetchScenarioWithRevisions)
- [x] [T023] `src/features/scenario/components/StatusBadge.tsx` 상태(draft/revision/production/complete) 색상 배지
- [x] [T024] `src/features/scenario/components/ScriptDisplay.tsx` script_content(마크다운)을 렌더링
- [x] [T025] `src/features/scenario/components/SceneList.tsx` scene_data(JSON) 배열을 장면 카드 목록으로 표시
- [x] [T026] `src/features/scenario/components/PdfViewer.tsx` react-pdf로 Storage PDF 렌더링 + `PdfViewerLazy.tsx` dynamic import
- [x] [T027] `src/features/scenario/components/ScenarioViewer.tsx` (ScenarioPageHeader) 메타정보 + 탭 네비게이션
- [x] [T028] `src/app/scenarios/[id]/page.tsx` 시나리오 상세 페이지 — 3열 레이아웃 (PDF | 스크립트 | 장면)

---

## Phase 5: Features — 관리자 Import (US-6)

- [x] [T029] `src/features/admin/components/PasswordGate.tsx` 관리자 비밀번호 입력 폼 `'use client'`
- [x] [T030] `src/app/api/admin/auth/route.ts` 관리자 인증 API — `ADMIN_PASSWORD` 검증, `admin_auth` 쿠키 (24시간, /admin 스코프)
- [x] [T031] `src/app/admin/layout.tsx` `/admin` 경로 보호 — `admin_auth` 쿠키 검증, 미인증 시 PasswordGate 표시
- [x] [T032] `src/app/admin/page.tsx` 관리자 홈 (Import·트리 관리·상태 갱신 링크 카드)
- [x] [T033] `scripts/import.ts` Node.js 임포트 스크립트 — `revised/` 폴더 스캔, scenario.json·script.md 파싱, Supabase upsert, PDF Storage 업로드
- [x] [T034] `.github/workflows/import.yml` GitHub Actions 워크플로우 — `revised/**` push 트리거, `scripts/import.ts` 실행
- [x] [T035] `src/app/admin/import/page.tsx` Import 현황 페이지 — 전체 시나리오 수 표시

---

## Phase 6: Features — 시나리오 편집 (US-3)

- [x] [T036] `src/app/scenarios/[id]/edit/actions.ts` Server Action — updateScenario (시나리오 저장 + scenario_revisions 이력 + 상태 자동 갱신)
- [x] [T037] `src/features/scenario/components/ScenarioEditor.tsx` 편집 폼 — `@uiw/react-md-editor` 스크립트 편집, 메타정보, 장면 추가/삭제/수정 `'use client'`
- [x] [T038] `src/app/scenarios/[id]/edit/page.tsx` 편집 페이지 — 기존 데이터 서버 패칭 후 ScenarioEditor에 전달

---

## Phase 7: Features — 콘티 시스템 (US-4)

- [x] [T039] `src/features/storyboard/lib/storyboard.ts` 콘티 목록 조회 함수 (fetchStoryboards)
- [x] [T040] `src/features/storyboard/components/LocalReaction.tsx` 👍 좋아요 버튼 — useState로 카운트 관리, 새로고침 시 초기화 `'use client'`
- [x] [T041] `src/features/storyboard/components/StoryboardCard.tsx` 콘티 카드 (썸네일/PDF 아이콘, 업로더명, LocalReaction)
- [x] [T042] `src/features/storyboard/components/StoryboardUpload.tsx` 파일 업로드 폼 — 드래그앤드롭, 이름 입력, 업로드 후 상태 자동 갱신 `'use client'`
- [x] [T043] `src/features/storyboard/components/StoryboardGallery.tsx` 갤러리 그리드 + StoryboardUpload
- [x] [T044] `src/app/scenarios/[id]/storyboards/page.tsx` 콘티 갤러리 페이지 — 서버에서 목록 패칭
- [x] [T045] `src/app/scenarios/[id]/storyboards/actions.ts` Server Action — syncStatusAfterUpload (콘티 업로드 후 상태 자동 갱신)

---

## Phase 8: Features — 대시보드 + 상태 관리 (US-5)

- [x] [T046] `src/features/dashboard/lib/dashboard.ts` 상태별 시나리오 카운트 쿼리, 전체 목록 조회 함수
- [x] [T047] `src/features/dashboard/components/StatusOverview.tsx` 상태별 통계 카드 4개 (draft/revision/production/complete)
- [x] [T048] `src/features/dashboard/components/ScenarioTable.tsx` 시나리오 테이블 — 상태 필터, 상태 변경 드롭다운, 에러 피드백 `'use client'`
- [x] [T049] `src/app/dashboard/actions.ts` Server Action — updateScenarioStatus (수동 상태 변경, .select('id')로 실제 업데이트 확인)
- [x] [T050] `src/app/dashboard/page.tsx` 대시보드 페이지 (StatusOverview + ScenarioTable)
- [x] [T051] `src/app/page.tsx` 루트 페이지 → `/dashboard` redirect
- [x] [T052] `src/lib/status-rules.ts` deriveStatus — 데이터 기반 상태 자동 판별 엔진
- [x] [T053] `src/lib/update-scenario-status.ts` syncScenarioStatus — DB 조회 후 상태 비교·갱신
- [x] [T054] `src/app/admin/sync-status/page.tsx` 관리자 상태 일괄 갱신 페이지
- [x] [T055] `src/app/admin/sync-status/actions.ts` Server Action — syncAllStatuses (전체 시나리오 상태 일괄 갱신)

---

## Phase 9: Features — 트리 분류 관리 (US-7)

- [x] [T056] `src/app/admin/trees/actions.ts` Server Actions — createTree, upsertTreeNode, deleteTreeNode, assignScenarioToNode
- [x] [T057] `src/features/admin/components/TreeEditor.tsx` 트리 편집기 — 노드 추가/삭제, 시나리오 매핑 `'use client'`
- [x] [T058] `src/app/admin/trees/page.tsx` 트리 관리 페이지 — 트리 선택 + TreeEditor

---

## Phase 10: Polish — 마무리

- [x] [T059] `src/app/scenarios/loading.tsx` + `src/app/scenarios/[id]/loading.tsx` 로딩 스켈레톤 UI
- [x] [T060] `src/app/scenarios/[id]/error.tsx` 에러 바운더리
- [x] [T061] `src/lib/utils.ts` 공통 유틸 (cn, formatDate, formatDuration, statusLabel)
- [x] [T062] `tests/tree.test.ts` 트리 변환 로직 단위 테스트 (flatToNested)

---

## 요약

| Phase | 태스크 수 | 주요 US |
|-------|-----------|---------|
| 1. Setup | 11 | — |
| 2. Auth | 3 | US-8 |
| 3. 트리 네비게이션 | 7 | US-1 |
| 4. 시나리오 뷰어 | 7 | US-2 |
| 5. 관리자 Import | 7 | US-6 |
| 6. 시나리오 편집 | 3 | US-3 |
| 7. 콘티 시스템 | 7 | US-4 |
| 8. 대시보드 + 상태 | 10 | US-5 |
| 9. 트리 분류 관리 | 3 | US-7 |
| 10. 마무리 | 4 | — |
| **합계** | **62** | |

### 의존성 순서
```
T001~T011 (Setup)
  → T012~T014 (Auth)
    → T015~T021 (트리) + T022~T028 (뷰어) [병렬 가능]
      → T029~T035 (Import) + T036~T038 (편집) + T039~T045 (콘티) [병렬 가능]
        → T046~T055 (대시보드 + 상태)
          → T056~T058 (트리 관리)
            → T059~T062 (마무리)
```
