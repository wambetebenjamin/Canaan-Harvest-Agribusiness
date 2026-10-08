import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { CATEGORIES } from '@/data/produce';
import { listPosts } from '@/lib/blog';

/** Dynamic sitemap — static routes, produce categories and every article. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/produce`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/order`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/partnership`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/farm-stories`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/legal/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/legal/cookie-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter((c) => c.id !== 'all').map(
    (cat) => ({
      url: `${base}/produce?category=${cat.id}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })
  );

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPosts();
    postRoutes = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    postRoutes = [];
  }

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
