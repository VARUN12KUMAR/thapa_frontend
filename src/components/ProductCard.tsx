import { Link } from 'react-router-dom';
import type { Product } from '../types/product';
import { mediaUrl } from '../api/client';
import { categoryLabel, formatPrice } from '../utils/format';

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images?.[0]?.url;

  return (
    <Link to={`/product/${product.id}`} className="product-tile">
      <div className="product-media">
        {cover ? (
          <img src={mediaUrl(cover)} alt={product.name} loading="lazy" />
        ) : (
          <div className="placeholder">AT</div>
        )}
      </div>
      <div className="product-meta">
        <div>
          <h3>{product.name}</h3>
          <div className="product-tags">
            <span>{categoryLabel(product.category)}</span>
            {product.isGiftHamper ? <span>Gift</span> : null}
          </div>
        </div>
        <div className="price">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}
