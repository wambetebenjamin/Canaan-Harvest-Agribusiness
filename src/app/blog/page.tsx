import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { listPosts } from '@/lib/blog';
import { Icon } from '@/lib/icons';
import { SITE } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog and Farm News',
  description:
    'Seasonal Kenyan produce guides, farming practice, nutrition and recipes, and sustainability notes from the Canaan Harvest farms.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog and Farm News | Canaan Harvest Agribusiness',
    description: 'Seasonal produce guides, farming tips, nutrition, recipes and sustainability.',
    url: `${SITE.url}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await listPosts();

  return (
    <>
      <PageTitle
        title="Blog and farm news"
        subtitle="What is in season, what we are planting, and how the supply chain actually behaves."
        breadcrumbs={[{ href: '/blog', label: 'Blog' }]}
        backgroundImage="/photos/blog/blog-1.jpg"
      />

      <section className="section" aria-labelledby="blog-heading">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">From the farms</p>
            <h2 id="blog-heading">Latest articles</h2>
          </div>

          <div className="post-grid">
            {posts.map((post) => (
              <article className="post-card" key={post.slug}>
                <div className="post-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image}
                    alt={post.alt}
                    width={640}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="post-card__body">
                  <p className="post-card__cat">{post.category}</p>
                  <h3>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <p className="post-card__meta">
                    <Icon name="calendar" size={13} />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-KE', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <span aria-hidden="true">·</span>
                    {post.readingTime}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
