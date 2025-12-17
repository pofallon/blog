import { NextResponse } from 'next/server';
import { getPlaceholderBySlug, isPlaceholderSlug } from '@/lib/placeholders';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isPlaceholderSlug(slug)) {
    return NextResponse.json(
      { message: `Placeholder not found for slug "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(getPlaceholderBySlug(slug));
}
