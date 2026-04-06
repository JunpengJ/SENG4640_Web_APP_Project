import axios from 'axios';

// Base URL for the API, configurable via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL, // Set the base URL for all API requests
  headers: { 'Content-Type': 'application/json' }, // Default headers for JSON requests
});

// Add an interceptor to include the Authorization token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
  }
  return config;
});

// Authentication APIs
export const register = (userData) => api.post('/auth/register', userData); // Register a new user
export const login = (email, password) => api.post('/auth/login', { email, password }); // Log in a user
export const getProfile = () => api.get('/auth/me'); // Get the current user's profile
export const updateProfile = (data) => api.put('/auth/me', data); // Update the current user's profile

// Product APIs
export const getProducts = (params = {}) => api.get('/products', { params }); // Get a list of products
export const getProduct = (id) => api.get(`/products/${id}`); // Get details of a single product
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);


// Cart APIs
export const getCart = () => api.get('/cart'); // Get the user's cart
export const addToCart = (productId, quantity = 1) => api.post('/cart', { productId, quantity }); // Add an item to the cart
export const updateCartItem = (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }); // Update the quantity of a cart item
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`); // Remove an item from the cart
export const clearCart = () => api.delete('/cart'); // Clear the cart

// Order APIs
export const createOrder = (orderData) => api.post('/orders', orderData); // Create a new order
export const getOrders = () => api.get('/orders'); // Get a list of orders
export const getOrder = (orderId) => api.get(`/orders/${orderId}`); // Get details of a single order

// Flash Sale APIs
export const getFlashSales = (status = 'active') => api.get('/flashsales', { params: { status } }); // Get a list of flash sales
export const getFlashSale = (id) => api.get(`/flashsales/${id}`); // Get details of a single flash sale
export const placeFlashSaleOrder = (flashSaleId, productId, quantity = 1) =>
    api.post(`/flashsale/${flashSaleId}`, { productId, quantity }); // Place an order for a flash sale
export const getFlashSaleOrderStatus = (jobId) => api.get(`/flashsale/status/${jobId}`); // Get the status of a flash sale order

// Category APIs
export const getCategories = () => api.get('/categories'); // Get a list of categories
export const getCategory = (id) => api.get(`/categories/${id}`); // Get details of a single category
export const createCategory = (data) => api.post('/categories', data); // Create a new category
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data); // Update an existing category
export const deleteCategory = (id) => api.delete(`/categories/${id}`); // Delete a category


// Alias for getting flash sale order status
export const getOrderStatus = getFlashSaleOrderStatus;