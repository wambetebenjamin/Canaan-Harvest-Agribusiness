import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '@/data/content';
import { readPost, listPosts } from '@/lib/blog';

export const runtime = 'nodejs';
export const revalidate = 300;

/**
 * GET /api/blog
 *   ?slug=<slug>  → a single MDX article with its rendered-or-raw body
 *   (no slug)     → the article index
 *
 * Reads from /content/blog/*.mdx, falling back to the bundled manifest in
 * src/data/content.ts for metadata when an MDX file has not been authored
 * yet — so the blog never renders an empty list.
 */
export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug');

  if (slug) {
    const post = await readPost(slug);
    if (!post) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, post });
  }

  const posts = await listPosts();
  return NextResponse.json({
    ok: true,
    count: posts.length,
    posts: posts.length > 0 ? posts : BLOG_POSTS,
  });
}
