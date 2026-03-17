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
- 콘텐츠(시나리오)는 DB에 하나, 목차 구조만 별도 JSON 파일로 복수 정의
- 각 JSON은 트리 노드 구조만 담고, 리프 노드가 시나리오 ID를 참조
- UI에서 트리 전환(드롭다운)으로 선택된 JSON 기준으로 렌더링
- 트리 JSON 예시:
  - `tree-by-law.json` — 법령 기준 분류 (현재 TOC 구조)
  - `tree-by-taxpayer.json` — 납세자 유불리 기준 분류
  - 추후 분류 기준 추가 시 JSON 파일만 추가하면 됨

### 시나리오 단계(Status)
각 시나리오는 다음 단계를 가진다:
1. `draft` — 시나리오 제작
2. `revision` — 수정중
3. `production` — 영상 제작중
4. `complete` — 제작 완료

### 콘티(Storyboard) 시스템
- 시나리오별로 여러 사람이 콘티를 업로드 가능
- 다양한 아이디어를 공유하고 평가(리뷰/투표)하는 협업 체계
- 콘티는 이미지, PDF 등 파일 업로드 지원

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript, React 19)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Package Manager**: pnpm
- **Testing**: vitest
- **Deployment**: Vercel

## Architecture

### Database (Supabase)
- **trees**: 트리 분류 정의 (복수의 분류 체계)
- **tree_nodes**: 트리 노드 (법령 → 세목 → 법률근거 → 하위테마)
- **scenarios**: 시나리오 메타데이터 + 상태(status)
- **storyboards**: 콘티 업로드 (시나리오별 복수)
- **reviews**: 콘티 평가/피드백
- **Storage**: PDF 원본, 콘티 이미지/파일 저장

### Frontend
- 트리 뷰어: 분류 기준 전환 가능한 트리 네비게이션
- 시나리오 뷰어: PDF 페이지 + 스크립트 + 상태 표시
- 콘티 갤러리: 업로드/조회/평가 UI
- 대시보드: 전체 시나리오 진행 현황

## Coding Conventions

- Code comments in Korean
- Commit messages in English
- Use TypeScript strict mode
- Use `@/*` import alias
- Server Components by default, Client Components only when needed
- Feature-based folder structure (`src/features/`)

## Non-Functional Requirements

- **Auth**: Supabase Auth (공유 사용자 간 권한 관리)
- **Performance**: 트리 구조는 클라이언트 캐싱, PDF는 lazy loading
- **Security**: Row Level Security (Supabase RLS)
- **Accessibility**: 기본 WCAG 2.1 AA 준수
