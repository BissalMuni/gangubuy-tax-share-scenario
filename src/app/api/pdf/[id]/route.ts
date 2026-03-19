import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** 시나리오 PDF 프록시 — CORS 우회용 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // 시나리오에서 pdf_path 조회
  const { data: scenario, error } = await supabase
    .from('scenarios')
    .select('pdf_path')
    .eq('id', id)
    .single();

  if (error || !scenario?.pdf_path) {
    return NextResponse.json({ error: 'PDF 없음' }, { status: 404 });
  }

  // pdf_path가 전체 URL인 경우 버킷 내 상대 경로 추출
  const pdfPath = scenario.pdf_path;
  let storagePath: string;
  if (pdfPath.includes('/storage/v1/object/public/pdfs/')) {
    storagePath = pdfPath.split('/storage/v1/object/public/pdfs/')[1];
  } else {
    storagePath = pdfPath;
  }

  // Supabase storage에서 PDF 다운로드
  const { data, error: downloadError } = await supabase.storage
    .from('pdfs')
    .download(decodeURIComponent(storagePath));

  if (downloadError || !data) {
    // Storage에 파일이 없으면 pdf_path 초기화
    await supabase
      .from('scenarios')
      .update({ pdf_path: null })
      .eq('id', id);
    return NextResponse.json({ error: 'PDF 파일을 찾을 수 없습니다' }, { status: 404 });
  }

  const arrayBuffer = await data.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
