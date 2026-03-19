"""
toc/ 폴더 내 시나리오별 PDF 파일들을 하나로 병합하는 스크립트.

사용법:
  pip install PyPDF2
  python scripts/merge_pdfs.py

입력: ../gangubuy-tax-revised/revised/toc/ 하위의 개별 PDF 파일들
출력: 각 시나리오 폴더에 merged.pdf 생성
"""

import os
import sys
from pathlib import Path

try:
    from PyPDF2 import PdfMerger
except ImportError:
    print("PyPDF2가 필요합니다. 설치 후 다시 실행하세요:")
    print("  pip install PyPDF2")
    sys.exit(1)

# 기본 경로 설정
SCRIPT_DIR = Path(__file__).parent
TOC_DIR = Path(os.environ.get(
    "TOC_DIR",
    SCRIPT_DIR.parent.parent / "gangubuy-tax-revised" / "revised" / "toc"
))


def find_scenario_dirs(toc_dir: Path) -> list[Path]:
    """PDF 파일이 있는 시나리오 폴더 목록 반환"""
    scenario_dirs = []
    for root, _dirs, files in os.walk(toc_dir):
        pdf_files = [f for f in files if f.endswith(".pdf") and f != "merged.pdf"]
        if pdf_files:
            scenario_dirs.append(Path(root))
    return scenario_dirs


def merge_pdfs_in_dir(scenario_dir: Path) -> Path | None:
    """폴더 내 PDF 파일들을 merged.pdf로 병합"""
    pdf_files = sorted(
        [f for f in scenario_dir.iterdir() if f.suffix == ".pdf" and f.name != "merged.pdf"],
        key=lambda f: f.name,  # p009.pdf, p010.pdf 등 자연 정렬
    )

    if len(pdf_files) == 0:
        return None

    if len(pdf_files) == 1:
        # 파일이 하나면 그대로 복사
        output = scenario_dir / "merged.pdf"
        if not output.exists() or output.stat().st_mtime < pdf_files[0].stat().st_mtime:
            import shutil
            shutil.copy2(pdf_files[0], output)
        return output

    output = scenario_dir / "merged.pdf"
    merger = PdfMerger()

    for pdf_file in pdf_files:
        merger.append(str(pdf_file))

    merger.write(str(output))
    merger.close()

    return output


def main():
    if not TOC_DIR.exists():
        print(f"toc 디렉토리를 찾을 수 없습니다: {TOC_DIR}")
        sys.exit(1)

    print(f"=== PDF 병합 시작 ===")
    print(f"대상 폴더: {TOC_DIR}")

    scenario_dirs = find_scenario_dirs(TOC_DIR)
    print(f"발견된 시나리오 폴더: {len(scenario_dirs)}개")

    success = 0
    for scenario_dir in scenario_dirs:
        rel_path = scenario_dir.relative_to(TOC_DIR)
        pdf_count = len([f for f in scenario_dir.iterdir() if f.suffix == ".pdf" and f.name != "merged.pdf"])

        result = merge_pdfs_in_dir(scenario_dir)
        if result:
            print(f"  ✓ {rel_path} ({pdf_count}페이지 → merged.pdf)")
            success += 1
        else:
            print(f"  ✗ {rel_path} (PDF 없음)")

    print(f"=== 병합 완료: {success}/{len(scenario_dirs)} ===")


if __name__ == "__main__":
    main()
