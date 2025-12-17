import { NextResponse } from 'next/server';
import { getSiteMetadata } from '@/lib/site-shell';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(getSiteMetadata());
}
