import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => api.post('/auth/register', userData);
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/me', data);

export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);

export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => api.post('/cart', { productId, quantity });
export const updateCartItem = (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart');

export const createOrder = (orderData) => api.post('/orders', orderData);
export const getOrders = () => api.get('/orders');
export const getOrder = (orderId) => api.get(`/orders/${orderId}`);

export const getFlashSales = (status = 'active') => api.get('/flashsales', { params: { status } });
export const getFlashSale = (id) => api.get(`/flashsales/${id}`);
export const placeFlashSaleOrder = (flashSaleId, productId, quantity = 1) =>
    api.post(`/flashsale/${flashSaleId}`, { productId, quantity });
export const getFlashSaleOrderStatus = (jobId) => api.get(`/flashsale/status/${jobId}`);

export const getOrderStatus = getFlashSaleOrderStatus;