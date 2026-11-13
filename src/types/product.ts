export type ProductCategory =
  | 'chain'
  | 'necklace'
  | 'earring'
  | 'ring'
  | 'bracelet'
  | 'anklet'
  | 'set'
  | 'gift_hamper'
  | 'other';

export type StockStatus =
  | 'available'
  | 'low_stock'
  | 'sold_out'
  | 'made_to_order';

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  isGiftHamper: boolean;
  stockStatus: StockStatus;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  tags: string[] | null;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
  instagramRequestUrl?: string;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  instagramProfileUrl?: string;
}

export interface ProductQuery {
  search?: string;
  category?: ProductCategory | '';
  isGiftHamper?: boolean;
  stockStatus?: StockStatus | '';
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name';
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  isGiftHamper?: boolean;
  stockStatus?: StockStatus;
  stockQuantity?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  tags?: string[];
}
