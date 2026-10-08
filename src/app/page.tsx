import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Journey from '@/components/Journey';
import ProduceCatalogue from '@/components/ProduceCatalogue';
import FarmGallery from '@/components/FarmGallery';
import ARFarmTour from '@/components/ARFarmTour';
import SubscriptionBoxes from '@/components/SubscriptionBoxes';
import Testimonials from '@/components/Testimonials';
import MascotBand from '@/components/MascotBand';
import { Icon } from '@/lib/icons';
import { BLOG_POSTS } from '@/data/content';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Fresh Kenyan Produce, Farm to Table',
  description: SITE.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const recentPosts = BLOG_POSTS.slice(0, 3);

  return (
    <>
      <Hero />
      <Journey />
      <ProduceCatalogue />
      <FarmGallery />
      <ARFarmTour />
      <SubscriptionBoxes />
      <MascotBand />
      <Testimonials />

      {/* ── Blog preview ─────────────────────────────────────────────────── */}
      <section className="section light-background" aria-labelledby="blog-preview-heading">
        <div className="container">
          <div className="section-title">
            <p className="eyebrow">Blog &amp; farm news</p>
            <h2 id="blog-preview-heading">Seasonal guides, farming practice and recipes</h2>
          </div>

          <div className="post-grid">
            {recentPosts.map((post) => (
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

          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Link href="/blog" className="btn btn-outline">
              <Icon name="file-text" size={17} />
              All articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
