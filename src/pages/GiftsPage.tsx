import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import type { PaginatedProducts, ProductCategory, ProductQuery } from '../types/product';

export function GiftsPage() {
  const [query, setQuery] = useState<ProductQuery>({
    page: 1,
    limit: 12,
    isGiftHamper: true,
    sortBy: 'newest',
  });
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [data, setData] = useState<PaginatedProducts | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts({ ...query, isGiftHamper: true })
      .then(setData)
      .catch(console.error);
  }, [query]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Gifts</span>
            <h2>Ready-to-gift hampers</h2>
          </div>
          <p>
            Curated boxes for birthdays, festivals, and quiet thank-yous. Request
            availability on Instagram DM.
          </p>
        </div>

        <ProductFilters
          value={query}
          categories={categories}
          onChange={(next) => setQuery({ ...next, isGiftHamper: true })}
          showGiftToggle={false}
        />

        {data?.items.length ? (
          <div className="product-grid">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty">Gift hampers will show here once marked in admin.</div>
        )}
      </div>
    </section>
  );
}
