'use client';

import dynamic from 'next/dynamic';

const PdfViewerInner = dynamic(
  () => import('./PdfViewer').then((m) => ({ default: m.PdfViewer })),
  {
    ssr: false,
    loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />,
  }
);

interface PdfViewerLazyProps {
  url: string;
}

/** PDF 뷰어 래퍼 (dynamic import, ssr: false) */
export function PdfViewerLazy({ url }: PdfViewerLazyProps) {
  return <PdfViewerInner url={url} />;
}
