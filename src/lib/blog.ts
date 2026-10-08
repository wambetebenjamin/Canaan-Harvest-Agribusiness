/**
 * MDX blog reader.
 *
 * Articles live in /content/blog/*.mdx with YAML front matter. When a slug
 * has no MDX file the bundled manifest in src/data/content.ts supplies the
 * metadata, so the index and detail pages always render something real
 * rather than 404ing on unwritten articles.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { BLOG_POSTS, type BlogPost } from '@/data/content';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogArticle extends BlogPost {
  /** Raw MDX body, compiled by the detail page. */
  body: string;
  /** True when the body came from an MDX file rather than the fallback. */
  authored: boolean;
}

export async function listPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const mdx = files.filter((f) => f.endsWith('.mdx'));
    if (!mdx.length) return BLOG_POSTS;

    const posts = await Promise.all(
      mdx.map(async (file) => {
        const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
        const { data } = matter(raw);
        const slug = file.replace(/\.mdx$/, '');
        const fallback = BLOG_POSTS.find((p) => p.slug === slug);
        return {
          slug,
          title: (data.title as string) ?? fallback?.title ?? slug,
          category: (data.category as string) ?? fallback?.category ?? 'Farm news',
          excerpt: (data.excerpt as string) ?? fallback?.excerpt ?? '',
          date: (data.date as string) ?? fallback?.date ?? new Date().toISOString().slice(0, 10),
          readingTime: (data.readingTime as string) ?? fallback?.readingTime ?? '5 min read',
          image: (data.image as string) ?? fallback?.image ?? '/photos/blog/blog-1.jpg',
          alt: (data.alt as string) ?? fallback?.alt ?? '',
        } satisfies BlogPost;
      })
    );

    // Newest first.
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch {
    // No MDX directory at all — the manifest stands in.
    return BLOG_POSTS;
  }
}

export async function readPost(slug: string): Promise<BlogArticle | null> {
  const fallback = BLOG_POSTS.find((p) => p.slug === slug);

  try {
    const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), 'utf8');
    const { data, content } = matter(raw);
    return {
      slug,
      title: (data.title as string) ?? fallback?.title ?? slug,
      category: (data.category as string) ?? fallback?.category ?? 'Farm news',
      excerpt: (data.excerpt as string) ?? fallback?.excerpt ?? '',
      date: (data.date as string) ?? fallback?.date ?? new Date().toISOString().slice(0, 10),
      readingTime: (data.readingTime as string) ?? fallback?.readingTime ?? '5 min read',
      image: (data.image as string) ?? fallback?.image ?? '/photos/blog/blog-1.jpg',
      alt: (data.alt as string) ?? fallback?.alt ?? '',
      body: content,
      authored: true,
    };
  } catch {
    if (!fallback) return null;
    return { ...fallback, body: '', authored: false };
  }
}

export async function listSlugs(): Promise<string[]> {
  const posts = await listPosts();
  return posts.map((p) => p.slug);
}
