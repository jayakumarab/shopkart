import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 Unauthorized, token may be expired or invalid
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register failure
      const isAuthUrl = error.config.url.includes("/auth/login") || error.config.url.includes("/auth/register");
      if (!isAuthUrl) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Dispatch custom event to notify AuthContext without hard reloading
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

/* ===========================
   AUTH API
   =========================== */
export const authAPI = {
  register: async (userData) => {
    const res = await api.post("/auth/register", userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },
};

/* ===========================
   CATEGORIES API
   =========================== */
export const categoriesAPI = {
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },
};

/* ===========================
   PRODUCTS API
   =========================== */
export const productsAPI = {
  getAll: async (params = {}) => {
    const res = await api.get("/products", { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  create: async (productData) => {
    const res = await api.post("/products", productData);
    return res.data;
  },
  update: async (id, productData) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

/* ===========================
   CART API
   =========================== */
export const cartAPI = {
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const res = await api.post("/cart", {
      product_id: Number(productId),
      quantity: Number(quantity),
    });
    return res.data;
  },
  updateQuantity: async (productId, quantity) => {
    const res = await api.put(`/cart/${productId}`, {
      quantity: Number(quantity),
    });
    return res.data;
  },
  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await api.delete("/cart");
    return res.data;
  },
};

/* ===========================
   ORDERS API
   =========================== */
export const ordersAPI = {
  createOrder: async (orderData) => {
    const res = await api.post("/orders", orderData);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get("/orders");
    return res.data;
  },
  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};

export default api;

