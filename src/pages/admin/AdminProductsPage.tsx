import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct, fetchAdminProducts } from '../../api/products';
import { mediaUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types/product';
import { categoryLabel, formatPrice, stockLabel } from '../../utils/format';

export function AdminProductsPage() {
  const toast = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(q = search) {
    setLoading(true);
    try {
      const data = await fetchAdminProducts({ search: q || undefined, limit: 50 });
      setItems(data.items);
    } catch {
      toast.error('Could not load products', 'Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(id: string, name: string) {
    if (!window.confirm(`Delete “${name}”? This cannot be undone.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted', name);
      await load();
    } catch {
      toast.error('Delete failed', 'Could not delete this product.');
    }
  }

  return (
    <div>
      <div className="admin-top">
        <div>
          <span className="eyebrow">Inventory</span>
          <h2>Products</h2>
        </div>
        <Link className="btn" to="/admin/products/new">
          Add product
        </Link>
      </div>

      <div className="filters" style={{ marginBottom: '1rem' }}>
        <div className="filters-row">
          <div className="field">
            <label htmlFor="admin-search">Search</label>
            <input
              id="admin-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or tag"
            />
          </div>
          <div className="field" style={{ alignSelf: 'end' }}>
            <button className="btn btn-outline" type="button" onClick={() => void load()}>
              Search
            </button>
          </div>
        </div>
      </div>

      {loading ? <div className="empty">Loading inventory…</div> : null}

      {!loading ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Qty</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((product) => {
                const cover = product.images?.[0]?.url;
                return (
                  <tr key={product.id}>
                    <td>
                      {cover ? (
                        <img className="thumb" src={mediaUrl(cover)} alt="" />
                      ) : (
                        <div className="thumb" />
                      )}
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      {product.isGiftHamper ? (
                        <div className="muted" style={{ fontSize: '0.8rem' }}>
                          Gift hamper
                        </div>
                      ) : null}
                    </td>
                    <td>{categoryLabel(product.category)}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{stockLabel(product.stockStatus)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{product.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link className="btn btn-outline" to={`/admin/products/${product.id}`}>
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline"
                          type="button"
                          onClick={() => void onDelete(product.id, product.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!items.length ? <div className="empty">No products yet.</div> : null}
        </div>
      ) : null}
    </div>
  );
}
