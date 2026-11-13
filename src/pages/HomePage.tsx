import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types/product';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [profileUrl, setProfileUrl] = useState(
    'https://instagram.com/aarushi_thapa_collection',
  );

  useEffect(() => {
    fetchProducts({ isFeatured: true, limit: 4 })
      .then((data) => {
        setFeatured(data.items);
        if (data.instagramProfileUrl) setProfileUrl(data.instagramProfileUrl);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-brand">Aarushi Thapa Collection</div>
          <h1>Jewellery made to gift — and to keep.</h1>
          <p>
            Browse chains, earrings, sets, and curated gift hampers. Request your
            piece on Instagram DM — we manage inventory there.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/shop">
              Explore pieces
            </Link>
            <Link className="btn btn-ghost" to="/gifts">
              Gift hampers
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Featured</span>
              <h2>Pieces in the light</h2>
            </div>
            <p>Selected favourites — tap through, then request on Instagram.</p>
          </div>
          {featured.length ? (
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty">Featured pieces will appear here once added in admin.</div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>Shop here. Request on Instagram.</h2>
            </div>
            <p>
              No cart checkout — open a product, tap Request on Instagram, and we
              confirm availability in DM.
            </p>
          </div>
          <a className="btn btn-outline" href={profileUrl} target="_blank" rel="noreferrer">
            Open Instagram
          </a>
        </div>
      </section>
    </>
  );
}
