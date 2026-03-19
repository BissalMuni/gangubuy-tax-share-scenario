'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/** 브라우저 Supabase 클라이언트 (싱글톤) */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
