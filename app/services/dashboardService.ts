import { API_ENDPOINTS } from '../config/api';
import type {
  AdminDashboardData,
  UserDashboardData,
} from '../types/dashboard';
import api from '../utils/api';

export function getDashboardStats(role: 'admin'): Promise<AdminDashboardData>;
export function getDashboardStats(role?: 'user'): Promise<UserDashboardData>;
export async function getDashboardStats(role: 'admin' | 'user' = 'user') {
  const { data } =
    role === 'admin'
      ? await api.get<AdminDashboardData>(API_ENDPOINTS.dashboard.admin)
      : await api.get<UserDashboardData>(API_ENDPOINTS.dashboard.user);
  return data;
}
