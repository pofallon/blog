import { NextResponse } from 'next/server';
import { getNavigationLinks } from '@/lib/navigation';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({ links: getNavigationLinks() });
}
