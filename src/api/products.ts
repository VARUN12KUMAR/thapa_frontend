import api from './client';
import type {
  CreateProductInput,
  PaginatedProducts,
  Product,
  ProductCategory,
  ProductQuery,
} from '../types/product';

function toParams(query: ProductQuery = {}) {
  const params: Record<string, string | number | boolean> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params[key] = value as string | number | boolean;
    }
  });
  return params;
}

export async function fetchProducts(
  query: ProductQuery = {},
): Promise<PaginatedProducts> {
  const { data } = await api.get<PaginatedProducts>('/products', {
    params: toParams(query),
  });
  return data;
}

export async function fetchProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const { data } = await api.get<ProductCategory[]>('/products/meta/categories');
  return data;
}

export async function fetchAdminProducts(
  query: ProductQuery = {},
): Promise<PaginatedProducts> {
  const { data } = await api.get<PaginatedProducts>('/admin/products', {
    params: toParams(query),
  });
  return data;
}

export async function fetchAdminProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/admin/products/${id}`);
  return data;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const { data } = await api.post<Product>('/admin/products', input);
  return data;
}

export async function updateProduct(
  id: string,
  input: Partial<CreateProductInput>,
): Promise<Product> {
  const { data } = await api.patch<Product>(`/admin/products/${id}`, input);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}

export async function uploadProductImages(
  id: string,
  files: FileList | File[],
): Promise<Product> {
  const form = new FormData();
  Array.from(files).forEach((file) => form.append('images', file));
  const { data } = await api.post<Product>(`/admin/products/${id}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<Product> {
  const { data } = await api.delete<Product>(
    `/admin/products/${productId}/images/${imageId}`,
  );
  return data;
}
