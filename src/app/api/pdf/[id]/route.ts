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

  // Supabase storage에서 PDF 다운로드
  const storagePath = `${id}.pdf`;
  const { data, error: downloadError } = await supabase.storage
    .from('pdfs')
    .download(storagePath);

  if (downloadError || !data) {
    return NextResponse.json({ error: 'PDF 다운로드 실패' }, { status: 502 });
  }

  const arrayBuffer = await data.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
