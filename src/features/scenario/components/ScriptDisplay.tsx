interface ScriptDisplayProps {
  content: string | null;
}

/** 나레이션 스크립트(마크다운) 표시 */
export function ScriptDisplay({ content }: ScriptDisplayProps) {
  if (!content) {
    return <p className="text-sm text-gray-500">스크립트가 없습니다.</p>;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">나레이션 스크립트</h3>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 bg-gray-50 rounded-lg p-4">
        {content}
      </div>
    </div>
  );
}
