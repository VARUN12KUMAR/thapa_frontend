import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct } from '../api/products';
import { ProductImageGallery } from '../components/ProductImageGallery';
import { StockBadge } from '../components/StockBadge';
import type { Product } from '../types/product';
import { categoryLabel, formatPrice } from '../utils/format';

export function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError('Product not found'));
  }, [id]);

  if (error) {
    return (
      <section className="section">
        <div className="container empty">
          {error}. <Link to="/shop">Back to shop</Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        <div className="container empty">Loading…</div>
      </section>
    );
  }

  return (
    <div className="container detail">
      <ProductImageGallery images={product.images ?? []} productName={product.name} />

      <div className="detail-copy">
        <span className="eyebrow">{categoryLabel(product.category)}</span>
        <h1>{product.name}</h1>
        <div className="price">{formatPrice(product.price)}</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <StockBadge status={product.stockStatus} />
          {product.isGiftHamper ? <span className="badge">Gift hamper</span> : null}
        </div>
        <p className="desc">{product.description}</p>
        {product.tags?.length ? (
          <div className="product-tags" style={{ marginBottom: '1.4rem' }}>
            {product.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        ) : null}
        <div className="hero-actions">
          {product.instagramRequestUrl ? (
            <a
              className="btn btn-gold"
              href={product.instagramRequestUrl}
              target="_blank"
              rel="noreferrer"
            >
              Request on Instagram
            </a>
          ) : null}
          <Link className="btn btn-outline" to="/shop">
            Back to shop
          </Link>
        </div>
        <p className="muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Availability is confirmed in Instagram DM. Product ID: {product.id.slice(0, 8)}…
        </p>
      </div>
    </div>
  );
}
