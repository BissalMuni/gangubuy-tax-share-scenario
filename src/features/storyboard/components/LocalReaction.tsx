'use client';

import { useState } from 'react';

/** 휘발성 좋아요 버튼 (클라이언트 상태, 새로고침 시 초기화) */
export function LocalReaction() {
  const [count, setCount] = useState(0);

  return (
    <button
      onClick={() => setCount((c) => c + 1)}
      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
    >
      <span>👍</span>
      {count > 0 && <span className="text-xs font-medium">{count}</span>}
    </button>
  );
}
