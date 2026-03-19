# Constitution

## Project: share-scenario

지방세법령 개정 내용을 기반으로 **세금정보 제공 유튜브 영상 시나리오**를 제작·공유·협업하는 플랫폼.

## 핵심 개념

### 데이터 소스 (`gangubuy-tax-revised/revised/`)
- **toc/**: 법령 개정 PDF를 분류한 원본 콘텐츠
  - 구조: 법령(localtax-law1, localtax-special-law1) → 세목(Ⅰ~Ⅹ) → 법률근거(지방세법, 시행령, 시행규칙) → 하위테마
- **scenarios/**: toc의 PDF를 분석하여 생성한 유튜브 영상 시나리오
  - toc와 동일한 폴더 구조로 분류
  - 각 하위테마별 scenario.json(메타+장면구성) + script.md(나레이션 스크립트)

### 트리 구조 설계
- **폴더 구조를 직접 트리로 사용하지 않는다**
- 콘텐츠(시나리오)는 DB에 하나, 트리 구조는 DB 테이블(`trees` + `tree_nodes`)로 복수 정의
- 각 트리 노드가 시나리오 ID를 참조하는 방식
- UI에서 트리 전환(드롭다운)으로 선택된 분류 기준으로 렌더링

### 시나리오 단계(Status) — 자동 판별
각 시나리오는 데이터 기반으로 상태가 자동 판별된다:
1. `draft` — 내용 없음 (기본)
2. `revision` — 스크립트 또는 장면 데이터 존재
3. `production` — 콘티(스토리보드) 업로드됨
4. `complete` — 스크립트 + 장면 + 콘티 + PDF 모두 존재
- 대시보드에서 수동 변경도 가능

### 콘티(Storyboard) 시스템
- 시나리오별로 여러 사람이 콘티를 업로드 가능
- 다양한 아이디어를 공유하고 평가(리뷰/투표)하는 협업 체계
- 콘티는 이미지, PDF 등 파일 업로드 지원
- 콘티 업로드 시 시나리오 상태가 자동으로 `production`으로 전환

### 인증 체계
- **2단계 비밀번호 보호** (회원가입 없음)
  - 사이트 접근: `SITE_PASSWORD` — Next.js middleware로 전체 경로 보호 (7일 쿠키)
  - 관리자 접근: `ADMIN_PASSWORD` — `/admin` 경로 추가 보호 (24시간 쿠키)

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Storage)
- **Package Manager**: pnpm
- **Testing**: vitest
- **Deployment**: Vercel

## Architecture

### Database (Supabase)
- **trees**: 트리 분류 정의 (복수의 분류 체계)
- **tree_nodes**: 트리 노드 (법령 → 세목 → 법률근거 → 하위테마)
- **scenarios**: 시나리오 메타데이터 + 상태(status) + updated_at 자동 갱신 트리거
- **scenario_revisions**: 수정 이력 (필드별 old/new 값 추적)
- **storyboards**: 콘티 업로드 (시나리오별 복수)
- **Storage 버킷**: `pdfs` (PDF 원본), `storyboards` (콘티 이미지/파일)

### Frontend
- 로그인 페이지: 비밀번호만 입력하는 단순 인증
- 트리 뷰어: 분류 기준 전환 가능한 트리 네비게이션
- 시나리오 뷰어: PDF + 스크립트 + 장면 구성 3열 레이아웃
- 콘티 갤러리: 업로드/조회/평가 UI
- 대시보드: 전체 시나리오 진행 현황 + 상태별 필터 + 상태 변경
- 관리자: Import 현황, 트리 관리, 상태 일괄 갱신

## Coding Conventions

- Code comments in Korean
- Commit messages in English
- Use TypeScript strict mode
- Use `@/*` import alias
- Server Components by default, Client Components only when needed
- Feature-based folder structure (`src/features/`)

## Non-Functional Requirements

- **Auth**: 환경변수 비밀번호 기반 (사이트 전체 + 관리자 별도)
- **Performance**: 트리 구조는 클라이언트 캐싱, PDF는 lazy loading
- **Security**: Row Level Security (Supabase RLS) — 전체 허용 정책 (인증은 앱 레이어)
- **Accessibility**: 기본 WCAG 2.1 AA 준수
