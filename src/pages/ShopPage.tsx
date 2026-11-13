import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { ProductFilters } from '../components/ProductFilters';
import type { PaginatedProducts, ProductCategory, ProductQuery } from '../types/product';

export function ShopPage() {
  const [query, setQuery] = useState<ProductQuery>({ page: 1, limit: 12, sortBy: 'newest' });
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetchProducts(query)
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 220);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Shop</span>
            <h2>All jewellery & pieces</h2>
          </div>
          <p>Filter by category, gift type, or price — then request on Instagram.</p>
        </div>

        <ProductFilters value={query} categories={categories} onChange={setQuery} />

        {loading ? <div className="empty">Loading pieces…</div> : null}

        {!loading && data?.items.length === 0 ? (
          <div className="empty">No products match these filters.</div>
        ) : null}

        {!loading && data?.items.length ? (
          <>
            <div className="product-grid">
              {data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={data.page <= 1}
                onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
              >
                Prev
              </button>
              <span className="muted">
                Page {data.page} / {data.totalPages}
              </span>
              <button
                className="btn btn-outline"
                disabled={data.page >= data.totalPages}
                onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
