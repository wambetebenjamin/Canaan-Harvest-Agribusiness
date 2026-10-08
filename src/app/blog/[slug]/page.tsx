import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PageTitle from '@/components/PageTitle';
import { listSlugs, readPost, listPosts } from '@/lib/blog';
import { BLOG_POSTS } from '@/data/content';
import { MDX_COMPONENTS } from '@/components/mdx/Steps';
import { Icon } from '@/lib/icons';
import { SITE } from '@/lib/site';

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listSlugs();
  return (slugs.length ? slugs : BLOG_POSTS.map((p) => p.slug)).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) return { title: 'Article not found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) notFound();

  const all = await listPosts();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: `${SITE.url}${post.image}`,
    articleSection: post.category,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icons/wordmark.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE.url}/blog/${post.slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageTitle
        title={post.title}
        breadcrumbs={[
          { href: '/blog', label: 'Blog' },
          { href: `/blog/${post.slug}`, label: post.category },
        ]}
        backgroundImage={post.image}
      />

      <section className="section" aria-labelledby="article-heading">
        <div className="container">
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <article className="prose" style={{ margin: '0 auto' }}>
              <p className="post-card__cat">{post.category}</p>
              <p className="post-card__meta" style={{ marginBottom: 26 }}>
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

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.alt}
                width={1200}
                height={675}
                style={{ borderRadius: 14, marginBottom: 30, width: '100%', height: 'auto' }}
              />

              {post.authored ? (
                <MDXRemote source={post.body} components={MDX_COMPONENTS} />
              ) : (
                <>
                  <p>{post.excerpt}</p>
                  <p>
                    The full article is being written up. In the meantime, our team is happy to
                    talk through any of this directly — the fastest route is WhatsApp on{' '}
                    {SITE.whatsappDisplay}.
                  </p>
                  <h2>What we can help with now</h2>
                  <ul>
                    <li>Current availability and grade standards for any produce line.</li>
                    <li>Delivery windows across Nairobi, six mornings a week.</li>
                    <li>Off-take agreements for farmers wanting a guaranteed buyer.</li>
                    <li>Cold-chain specifications for export consignments.</li>
                  </ul>
                  <p>
                    <Link href="/contact">Send us an enquiry</Link> or{' '}
                    <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">
                      message us on WhatsApp
                    </a>
                    .
                  </p>
                </>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section light-background" aria-labelledby="related-heading">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Keep reading</p>
            <h2 id="related-heading">More from the farms</h2>
          </div>

          <div className="post-grid">
            {related.map((rel) => (
              <article className="post-card" key={rel.slug}>
                <div className="post-card__media">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rel.image} alt={rel.alt} width={640} height={400} loading="lazy" />
                </div>
                <div className="post-card__body">
                  <p className="post-card__cat">{rel.category}</p>
                  <h3>
                    <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                  </h3>
                  <p>{rel.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
