# Plan

## Project: share-scenario

지방세법령 개정 세금정보 유튜브 영상 시나리오 제작·공유·협업 플랫폼.

---

## 1. 아키텍처 개요

```
[Browser]
  │
  ├─ /login — 비밀번호 인증 (SITE_PASSWORD)
  │
  ├─ middleware.ts — site_auth 쿠키 검증, 미인증 시 /login 리다이렉트
  │
  ├─ Server Components (RSC) — 기본
  │    └─ 트리 네비게이션, 시나리오 상세, 대시보드
  │
  └─ Client Components — 필요시만
       └─ PDF 뷰어, 시나리오 편집, 파일 업로드, 트리 선택 상태

[Next.js App Router]  ←→  [Supabase]
                              ├─ PostgreSQL (DB)
                              └─ Storage (PDF, 콘티 파일)
```

**핵심 설계 원칙:**
- 2단계 비밀번호 인증 (사이트: `SITE_PASSWORD`, 관리자: `ADMIN_PASSWORD`)
- 트리 구조는 DB의 `trees` + `tree_nodes` 테이블로 관리
- 시나리오 콘텐츠는 DB에 저장, 트리는 시나리오 ID만 참조
- Server Actions로 DB 변경 처리
- 시나리오 상태는 데이터 기반 자동 판별 (`status-rules.ts`)

---

## 2. DB 스키마

### `trees` — 분류 체계
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
slug        text UNIQUE NOT NULL  -- 'by-law', 'by-taxpayer'
name        text NOT NULL          -- '법령 기준', '납세자 유불리 기준'
description text
created_at  timestamptz DEFAULT now()
```

### `tree_nodes` — 트리 노드
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
tree_id     uuid REFERENCES trees(id) ON DELETE CASCADE
parent_id   uuid REFERENCES tree_nodes(id) ON DELETE CASCADE  -- NULL = 루트
label       text NOT NULL
sort_order  integer DEFAULT 0
scenario_id uuid REFERENCES scenarios(id) ON DELETE SET NULL  -- 리프 노드만
depth       integer DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### `scenarios` — 시나리오
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
title          text NOT NULL
status         text DEFAULT 'draft'  -- draft/revision/production/complete
law_basis      text                   -- 법률근거 (지방세법, 시행령 등)
effective_date date                   -- 시행일
video_duration integer                -- 영상길이(초)
script_content text                   -- script.md 내용
scene_data     jsonb                  -- scenario.json의 scenes 배열
pdf_path       text                   -- Supabase Storage 경로
created_at     timestamptz DEFAULT now()
updated_at     timestamptz DEFAULT now()
-- TRIGGER: scenarios_updated_at — BEFORE UPDATE시 updated_at 자동 갱신
```

### `scenario_revisions` — 수정 이력
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
scenario_id uuid REFERENCES scenarios(id) ON DELETE CASCADE
field       text NOT NULL    -- 수정된 필드명
old_value   text
new_value   text
created_at  timestamptz DEFAULT now()
```

### `storyboards` — 콘티
```sql
id            uuid PRIMARY KEY DEFAULT gen_random_uuid()
scenario_id   uuid REFERENCES scenarios(id) ON DELETE CASCADE
uploader_name text NOT NULL
file_path     text NOT NULL    -- Supabase Storage 공개 URL
file_type     text NOT NULL    -- 'image' | 'pdf'
description   text
created_at    timestamptz DEFAULT now()
```

> 콘티 평가(reviews)는 휘발성(새로고침 초기화)이므로 DB 저장 없이 클라이언트 상태로 처리.

### RLS 정책
- 모든 테이블: SELECT/INSERT/UPDATE/DELETE 전체 허용 (`USING (true)`)
- 인증은 앱 레이어(middleware + 쿠키)에서 처리

### Storage 버킷
- `pdfs` — PDF 파일 (public read)
- `storyboards` — 콘티 이미지/PDF (public read)

---

## 3. 파일 구조

```
middleware.ts                        # 사이트 비밀번호 보호 (site_auth 쿠키 검증)
src/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃
│   ├── page.tsx                      # / → /dashboard 리다이렉트
│   ├── login/
│   │   └── page.tsx                  # 비밀번호 로그인 페이지
│   ├── dashboard/
│   │   ├── page.tsx                  # 전체 진행 현황 대시보드
│   │   └── actions.ts               # updateScenarioStatus (수동 상태 변경)
│   ├── scenarios/
│   │   ├── page.tsx                  # 트리 네비게이션 + 목록
│   │   └── [id]/
│   │       ├── page.tsx              # 시나리오 상세 (PDF + 스크립트 + 장면)
│   │       ├── edit/
│   │       │   ├── page.tsx          # 시나리오 편집
│   │       │   └── actions.ts       # updateScenario + 수정이력 + 상태자동갱신
│   │       └── storyboards/
│   │           ├── page.tsx          # 콘티 갤러리
│   │           └── actions.ts       # syncStatusAfterUpload (콘티 업로드 후 상태 갱신)
│   ├── admin/
│   │   ├── layout.tsx                # ADMIN_PASSWORD 보호 레이아웃
│   │   ├── page.tsx                  # 관리자 홈 (메뉴 카드)
│   │   ├── import/
│   │   │   └── page.tsx              # Import 현황
│   │   ├── trees/
│   │   │   ├── page.tsx              # 트리 분류 관리
│   │   │   └── actions.ts           # createTree, upsertTreeNode, deleteTreeNode
│   │   └── sync-status/
│   │       ├── page.tsx              # 상태 일괄 갱신
│   │       └── actions.ts           # syncAllStatuses
│   └── api/
│       ├── auth/
│       │   └── login/
│       │       └── route.ts          # 사이트 비밀번호 인증 API
│       ├── admin/
│       │   └── auth/
│       │       └── route.ts          # 관리자 비밀번호 인증 API
│       └── pdf/
│           └── [id]/
│               └── route.ts          # PDF 프록시 (Supabase Storage → 클라이언트)
│
├── features/
│   ├── tree/
│   │   ├── components/               # TreeNav, TreeSelector, TreeNodeItem
│   │   ├── hooks/useTreeState.ts     # Zustand 스토어
│   │   ├── lib/tree.ts               # fetchTrees, fetchTreeWithNodes, flatToNested
│   │   └── types.ts
│   ├── scenario/
│   │   ├── components/               # ScenarioViewer, ScenarioEditor, SceneList,
│   │   │                             # PdfViewer, PdfViewerLazy, ScriptDisplay, StatusBadge
│   │   └── lib/scenario.ts           # fetchScenario, fetchAllScenarios
│   ├── storyboard/
│   │   ├── components/               # StoryboardGallery, StoryboardUpload,
│   │   │                             # StoryboardCard, LocalReaction
│   │   └── lib/storyboard.ts         # fetchStoryboards
│   ├── dashboard/
│   │   ├── components/               # StatusOverview, ScenarioTable
│   │   └── lib/dashboard.ts          # fetchStatusCounts, fetchScenarioList
│   └── admin/
│       └── components/               # PasswordGate, TreeEditor
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # 브라우저 Supabase 클라이언트 (싱글톤)
│   │   ├── server.ts                 # 서버 Supabase 클라이언트 (쿠키 기반)
│   │   └── types.ts                  # Supabase Database 타입
│   ├── utils.ts                      # cn, formatDate, formatDuration, statusLabel
│   ├── status-rules.ts              # deriveStatus — 데이터 기반 상태 자동 판별
│   └── update-scenario-status.ts    # syncScenarioStatus — DB 조회 후 상태 갱신
│
└── types/
    └── index.ts                      # Scenario, SceneData, Tree, TreeNode, Storyboard, ScenarioRevision
```

---

## 4. 의존성

### 추가 필요 패키지

| 패키지 | 용도 | 비고 |
|--------|------|------|
| `@supabase/supabase-js` | Supabase 클라이언트 | |
| `@supabase/ssr` | Next.js SSR 쿠키 처리 | |
| `react-pdf` | PDF 뷰어 | `pdfjs-dist` 포함 |
| `@uiw/react-md-editor` | 마크다운 스크립트 편집 | 가볍고 TypeScript 지원 |
| `zustand` | 클라이언트 상태 (트리 펼침 상태 등) | |
| `vitest` | 테스트 | |
| `@vitejs/plugin-react` | vitest React 지원 | |
| `@testing-library/react` | 컴포넌트 테스트 | |

---

## 5. 구현 순서 (우선순위별)

### Phase 1: 기반 설정 (P0)

1. **의존성 설치**
2. **환경 변수 설정** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SITE_PASSWORD`, `ADMIN_PASSWORD`
3. **Supabase 클라이언트 설정** — `client.ts` (브라우저), `server.ts` (서버)
4. **DB 스키마 마이그레이션** — 5개 테이블 + RLS + Storage 버킷
5. **핵심 타입 정의**
6. **vitest 설정**

### Phase 2: 인증 (P0) — US-8

7. 사이트 비밀번호 인증 API (`/api/auth/login`)
8. 로그인 페이지 (`/login`)
9. middleware.ts — 전체 경로 보호

### Phase 3: 트리 네비게이션 (P0) — US-1

10. 트리 데이터 패칭 + 중첩 변환 로직
11. TreeSelector, TreeNodeItem, TreeNav 컴포넌트
12. `/scenarios` 페이지

### Phase 4: 시나리오 뷰어 (P0) — US-2

13. 시나리오 패칭 함수
14. StatusBadge, ScriptDisplay, SceneList, PdfViewer 컴포넌트
15. `/scenarios/[id]` 상세 페이지 — 3열 레이아웃

### Phase 5: 관리자 Import (P1) — US-6

16. PasswordGate + admin layout (ADMIN_PASSWORD 보호)
17. import 스크립트 + GitHub Actions 워크플로우
18. Import 현황 페이지

### Phase 6: 시나리오 편집 (P1) — US-3

19. Server Action — updateScenario + revision 이력 + 상태 자동 갱신
20. ScenarioEditor 컴포넌트
21. `/scenarios/[id]/edit` 편집 페이지

### Phase 7: 콘티 시스템 (P1) — US-4

22. 콘티 조회/업로드 함수
23. StoryboardUpload, StoryboardCard, StoryboardGallery 컴포넌트
24. `/scenarios/[id]/storyboards` 페이지
25. 콘티 업로드 후 상태 자동 갱신

### Phase 8: 대시보드 + 상태 관리 (P1) — US-5

26. 상태별 통계 쿼리 + StatusOverview 컴포넌트
27. ScenarioTable (필터 + 상태 변경 드롭다운)
28. 상태 자동 판별 엔진 (`status-rules.ts`, `update-scenario-status.ts`)
29. 관리자 상태 일괄 갱신 페이지 (`/admin/sync-status`)
30. `/dashboard` 페이지

### Phase 9: 트리 분류 관리 (P2) — US-7

31. Server Actions — createTree, upsertTreeNode, deleteTreeNode
32. TreeEditor 컴포넌트
33. `/admin/trees` 페이지

### Phase 10: 마무리 (P2)

34. 로딩 스켈레톤 + 에러 바운더리
35. 공통 유틸리티
36. 단위 테스트

---

## 6. 기술적 결정 사항

| 결정 | 선택 | 근거 |
|------|------|------|
| 트리 저장소 | DB (`trees` + `tree_nodes`) | JSON 파일보다 쿼리·관리 유연, UI에서 실시간 편집 가능 |
| PDF 뷰어 | `react-pdf` | React 생태계 표준, Supabase Storage URL 직접 사용 가능 |
| 스크립트 편집기 | `@uiw/react-md-editor` | 마크다운 스크립트에 적합, 가벼움 |
| 클라이언트 상태 | `zustand` | 트리 펼침 상태 등 간단한 클라이언트 상태에 적합 |
| 사이트 보호 | 환경변수 비밀번호 (Next.js middleware) | 팀 내부 도구이므로 OAuth 불필요 |
| 관리자 보호 | 별도 환경변수 비밀번호 (layout + 쿠키) | 2단계 보안 분리 |
| 콘티 평가 | 클라이언트 상태 only | spec 명시: 휘발성, DB 저장 불필요 |
| Import 방식 | GitHub Actions + `scripts/import.ts` | revised/ push 시 자동 동기화 |
| 상태 관리 | 자동 판별 + 수동 변경 병행 | 데이터 기반 자동 전환으로 일관성 확보, 수동 오버라이드도 가능 |
| PDF 프록시 | API Route (`/api/pdf/[id]`) | CORS 문제 회피, 캐싱 헤더 제어 |

---

## 7. Constitution 정합성 검증

| 원칙 | 반영 여부 |
|------|-----------|
| 트리 구조를 폴더 구조로 사용하지 않음 | ✅ DB 기반 트리 노드 설계 |
| 콘텐츠(시나리오)는 DB에 하나, 목차 구조만 별도 정의 | ✅ scenarios 테이블 분리, tree_nodes가 참조 |
| UI에서 트리 전환 가능 | ✅ TreeSelector + 복수 trees 지원 |
| Server Components by default | ✅ 뷰어·목록은 Server, 상호작용만 Client |
| Feature-based folder structure | ✅ `src/features/` 하위 분리 |
| 2단계 비밀번호 인증 | ✅ SITE_PASSWORD + ADMIN_PASSWORD |
| 시나리오 상태 자동 판별 | ✅ status-rules.ts + syncScenarioStatus |
| pnpm + vitest | ✅ 의존성에 포함 |
