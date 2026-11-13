import type { ProductCategory, ProductQuery } from '../types/product';
import { categoryLabel } from '../utils/format';

interface Props {
  value: ProductQuery;
  categories: ProductCategory[];
  onChange: (next: ProductQuery) => void;
  showGiftToggle?: boolean;
}

export function ProductFilters({
  value,
  categories,
  onChange,
  showGiftToggle = true,
}: Props) {
  return (
    <div className="filters">
      <div className="filters-row">
        <div className="field">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            placeholder="Chain, pearl, festive…"
            value={value.search ?? ''}
            onChange={(e) => onChange({ ...value, search: e.target.value, page: 1 })}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={value.category ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                category: (e.target.value || undefined) as ProductCategory | undefined,
                page: 1,
              })
            }
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sortBy">Sort</label>
          <select
            id="sortBy"
            value={value.sortBy ?? 'newest'}
            onChange={(e) =>
              onChange({
                ...value,
                sortBy: e.target.value as ProductQuery['sortBy'],
                page: 1,
              })
            }
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="minPrice">Min price</label>
          <input
            id="minPrice"
            type="number"
            min={0}
            value={value.minPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
          />
        </div>
        <div className="field">
          <label htmlFor="maxPrice">Max price</label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            value={value.maxPrice ?? ''}
            onChange={(e) =>
              onChange({
                ...value,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
          />
        </div>
      </div>

      {showGiftToggle ? (
        <div className="chip-row">
          <button
            type="button"
            className={`chip ${value.isGiftHamper === undefined ? 'active' : ''}`}
            onClick={() => onChange({ ...value, isGiftHamper: undefined, page: 1 })}
          >
            All pieces
          </button>
          <button
            type="button"
            className={`chip ${value.isGiftHamper === true ? 'active' : ''}`}
            onClick={() => onChange({ ...value, isGiftHamper: true, page: 1 })}
          >
            Gift hampers
          </button>
          <button
            type="button"
            className={`chip ${value.isGiftHamper === false ? 'active' : ''}`}
            onClick={() => onChange({ ...value, isGiftHamper: false, page: 1 })}
          >
            Jewellery only
          </button>
        </div>
      ) : null}
    </div>
  );
}
