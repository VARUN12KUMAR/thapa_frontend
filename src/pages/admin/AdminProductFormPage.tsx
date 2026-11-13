import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createProduct,
  deleteProductImage,
  fetchAdminProduct,
  fetchCategories,
  updateProduct,
  uploadProductImages,
} from '../../api/products';
import { mediaUrl } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import type {
  CreateProductInput,
  Product,
  ProductCategory,
  StockStatus,
} from '../../types/product';
import { categoryLabel } from '../../utils/format';

const emptyForm: CreateProductInput = {
  name: '',
  description: '',
  price: 0,
  category: 'chain',
  isGiftHamper: false,
  stockStatus: 'available',
  stockQuantity: 0,
  isFeatured: false,
  isActive: true,
  tags: [],
};

export function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<CreateProductInput>(emptyForm);
  const [tagsText, setTagsText] = useState('');
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const pendingPreviews = useMemo(
    () =>
      pendingFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [pendingFiles],
  );

  useEffect(() => {
    return () => {
      pendingPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [pendingPreviews]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {
      toast.error('Could not load categories');
    });
  }, [toast]);

  useEffect(() => {
    if (!id) return;
    fetchAdminProduct(id)
      .then((data) => {
        setProduct(data);
        setForm({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          category: data.category,
          isGiftHamper: data.isGiftHamper,
          stockStatus: data.stockStatus,
          stockQuantity: data.stockQuantity,
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          tags: data.tags ?? [],
        });
        setTagsText((data.tags ?? []).join(', '));
      })
      .catch(() => toast.error('Could not load product'));
  }, [id, toast]);

  function addPendingFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files);
    setPendingFiles((prev) => [...prev, ...next]);
    toast.info(
      `${next.length} image${next.length > 1 ? 's' : ''} selected`,
      'They will upload when you save.',
    );
  }

  function removePendingFile(index: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info('Image removed from selection');
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload: CreateProductInput = {
      ...form,
      tags: tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isGiftHamper:
        form.category === 'gift_hamper' ? true : form.isGiftHamper,
    };

    try {
      if (isEdit && id) {
        const updated = await updateProduct(id, payload);
        if (pendingFiles.length) {
          const withImages = await uploadProductImages(id, pendingFiles);
          setProduct(withImages);
          setPendingFiles([]);
          toast.success('Product updated', `${pendingFiles.length} image(s) uploaded.`);
        } else {
          setProduct(updated);
          toast.success('Product updated', updated.name);
        }
      } else {
        const created = await createProduct(payload);
        if (pendingFiles.length) {
          await uploadProductImages(created.id, pendingFiles);
          toast.success(
            'Product created',
            `${created.name} with ${pendingFiles.length} image(s).`,
          );
        } else {
          toast.success('Product created', created.name);
        }
        navigate(`/admin/products/${created.id}`);
      }
    } catch {
      toast.error(
        isEdit ? 'Update failed' : 'Create failed',
        'Please check the form and try again.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function onUploadExisting(files: FileList | null) {
    if (!id || !files?.length) return;
    try {
      const updated = await uploadProductImages(id, files);
      setProduct(updated);
      toast.success(
        'Images uploaded',
        `${files.length} image${files.length > 1 ? 's' : ''} added.`,
      );
    } catch {
      toast.error('Upload failed', 'Could not upload images.');
    }
  }

  async function onRemoveImage(imageId: string) {
    if (!id) return;
    try {
      const updated = await deleteProductImage(id, imageId);
      setProduct(updated);
      toast.success('Image deleted');
    } catch {
      toast.error('Could not delete image');
    }
  }

  return (
    <div>
      <div className="admin-top">
        <div>
          <span className="eyebrow">Inventory</span>
          <h2>{isEdit ? 'Edit product' : 'Add product'}</h2>
        </div>
        <Link className="btn btn-outline" to="/admin/products">
          Back
        </Link>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="filters-row">
          <div className="field">
            <label htmlFor="price">Price (INR)</label>
            <input
              id="price"
              type="number"
              min={0}
              step="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => {
                const category = e.target.value as ProductCategory;
                setForm({
                  ...form,
                  category,
                  isGiftHamper:
                    category === 'gift_hamper' ? true : form.isGiftHamper,
                });
              }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="stockStatus">Stock status</label>
            <select
              id="stockStatus"
              value={form.stockStatus}
              onChange={(e) =>
                setForm({ ...form, stockStatus: e.target.value as StockStatus })
              }
            >
              <option value="available">Available</option>
              <option value="low_stock">Low stock</option>
              <option value="sold_out">Sold out</option>
              <option value="made_to_order">Made to order</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="stockQuantity">Quantity</label>
            <input
              id="stockQuantity"
              type="number"
              min={0}
              value={form.stockQuantity}
              onChange={(e) =>
                setForm({ ...form, stockQuantity: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="tags">Tags (comma separated)</label>
          <input
            id="tags"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="gold, bridal, festive"
          />
        </div>

        <div className="chip-row">
          <label className="chip">
            <input
              type="checkbox"
              checked={Boolean(form.isGiftHamper)}
              onChange={(e) => setForm({ ...form, isGiftHamper: e.target.checked })}
              style={{ marginRight: '0.4rem' }}
            />
            Gift hamper
          </label>
          <label className="chip">
            <input
              type="checkbox"
              checked={Boolean(form.isFeatured)}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              style={{ marginRight: '0.4rem' }}
            />
            Featured
          </label>
          <label className="chip">
            <input
              type="checkbox"
              checked={Boolean(form.isActive)}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              style={{ marginRight: '0.4rem' }}
            />
            Active on storefront
          </label>
        </div>

        <div className="image-manager">
          <h3 style={{ fontSize: '1.6rem' }}>Product images</h3>
          <p className="muted">
            Select multiple photos now (front, side, close-up, packing). They upload
            when you save.
          </p>
          <div className="field">
            <label htmlFor="pending-images">Add images</label>
            <input
              id="pending-images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                addPendingFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>

          {pendingPreviews.length ? (
            <div className="image-list">
              {pendingPreviews.map((preview, index) => (
                <div className="image-item" key={`${preview.file.name}-${index}`}>
                  <img src={preview.url} alt={preview.file.name} />
                  <button type="button" onClick={() => removePendingFile(index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {isEdit && product?.images?.length ? (
            <>
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                Saved images
              </p>
              <div className="image-list">
                {product.images.map((image) => (
                  <div className="image-item" key={image.id}>
                    <img src={mediaUrl(image.url)} alt={image.alt ?? ''} />
                    <button type="button" onClick={() => void onRemoveImage(image.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="field" style={{ marginTop: '0.75rem' }}>
                <label htmlFor="extra-images">Upload more to this product</label>
                <input
                  id="extra-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    void onUploadExisting(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={saving}>
            {saving
              ? 'Saving…'
              : isEdit
                ? 'Save changes'
                : pendingFiles.length
                  ? `Create product + ${pendingFiles.length} image(s)`
                  : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  );
}
