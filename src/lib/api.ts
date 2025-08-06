import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm JWT token
api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor để xử lý response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn, xóa token và redirect về login
      Cookies.remove('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/admin/login', { username, password });
    return response.data;
  },
};

// P2P Orders API
export const p2pAPI = {
  getOrders: async (page: number = 1, limit: number = 20) => {
    const response = await api.get(`/admin/p2p/orders?page=${page}&limit=${limit}`);
    return response.data;
  },
  confirmOrder: async (orderId: string, txHash?: string) => {
    const response = await api.post(`/admin/p2p/orders/${orderId}/confirm`, { txHash });
    return response.data;
  },
  cancelOrder: async (orderId: string) => {
    const response = await api.post(`/admin/p2p/orders/${orderId}/cancel`);
    return response.data;
  },
};

// Config API
export const configAPI = {
  getConfig: async () => {
    const response = await api.get('/config');
    return response.data;
  },
  updateConfig: async (config: any) => {
    const response = await api.put('/admin/config', config);
    return response.data;
  },
};

// Tokens API
export const tokensAPI = {
  getTokens: async () => {
    const response = await api.get('/tokens');
    return response.data;
  },
  refreshTokens: async () => {
    const response = await api.post('/tokens/refresh');
    return response.data;
  },
};

// Prices API
export const pricesAPI = {
  getPrices: async (symbols: string[]) => {
    const response = await api.get(`/prices?symbols=${symbols.join(',')}`);
    return response.data;
  },
};

export default api;
