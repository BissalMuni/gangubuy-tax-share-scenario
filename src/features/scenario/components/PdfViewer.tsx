'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

/** PDF 뷰어 (클라이언트 컴포넌트, react-pdf) */
export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-100">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <span className="text-sm font-semibold text-gray-900">원본 PDF</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="px-2 py-1 text-sm font-medium text-gray-700 rounded border disabled:opacity-50"
          >
            이전
          </button>
          <span className="text-sm font-medium text-gray-800">
            {currentPage} / {numPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
            disabled={currentPage >= numPages}
            className="px-2 py-1 text-sm font-medium text-gray-700 rounded border disabled:opacity-50"
          >
            다음
          </button>
        </div>
      </div>
      <div className="flex justify-center p-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="py-8 text-sm text-gray-600">PDF 로딩 중...</div>}
          error={<div className="py-8 text-sm text-red-500">PDF를 불러올 수 없습니다.</div>}
        >
          <Page pageNumber={currentPage} width={600} />
        </Document>
      </div>
    </div>
  );
}
