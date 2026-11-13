import type { ProductCategory, StockStatus } from '../types/product';

export function formatPrice(price: string | number): string {
  const value = typeof price === 'string' ? Number(price) : price;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function categoryLabel(category: ProductCategory): string {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function stockLabel(status: StockStatus): string {
  switch (status) {
    case 'available':
      return 'Available';
    case 'low_stock':
      return 'Low stock';
    case 'sold_out':
      return 'Sold out';
    case 'made_to_order':
      return 'Made to order';
    default:
      return status;
  }
}
