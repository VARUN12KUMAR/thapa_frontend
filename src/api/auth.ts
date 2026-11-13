import api from './client';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{
    accessToken: string;
    admin: AdminUser;
  }>('/auth/login', { email, password });
  return data;
}

export async function fetchMe(): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>('/auth/me');
  return data;
}
