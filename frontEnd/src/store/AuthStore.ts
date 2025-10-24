// ...existing code...
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type UserData = {
  email: string;
  password: string;
};

type TokenPayload = {
  userId: string;
  role: string;
  exp: number;
  iat: number;
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  image: File;
};

type AuthStore = {
  token: string | null;
  user: TokenPayload | null;
  error: string | null;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isTokenExpired: () => boolean;
  isTokenExpiringSoon: () => boolean;
  register: (userData: FormData) => Promise<string | void>;
};

//axios api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//zustand
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      error: null,

      login: async (userData: UserData) => {
        try {
          const res = await api.post("/api/v1/login", userData);
          const token = res.data.accessToken;
          const user = jwtDecode<TokenPayload>(token);
          set({ token, user, error: null });
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message });
          throw err;
        }
      },

      register: async (userData: FormData) => {
        try {
          const res = await api.post("/api/v1/register", userData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          console.log("register response:", res.data);
          set({ error: null });
          return res.data?.message ?? res.data;
        } catch (err: any) {
          set({ error: err.response?.data?.message || err.message });
          throw err;
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/v1/logout");
        } catch (err) {
          console.warn("Logout request failed:", err);
        }
        set({ token: null, user: null, error: null });
      },

      refresh: async () => {
        try {
          const res = await api.post("/api/v1/refresh");
          const token = res.data.accessToken;
          const user = jwtDecode<TokenPayload>(token);
          set({ token, user });
          return token;
        } catch (err) {
          console.error("Refresh failed:", err);
          set({ token: null, user: null });
          return null;
        }
      },

      isTokenExpired: () => {
        const { user } = get();
        if (!user?.exp) return true;
        return Date.now() >= user.exp * 1000;
      },

      isTokenExpiringSoon: () => {
        const { user } = get();
        if (!user?.exp) return true;
        return Date.now() >= user.exp * 1000 - 30_000;
      },
    }),
    { name: "auth-storage" }
  )
);

// Request interceptor: just attach token if it exists
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: refresh token only if 401 occurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once to prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refresh();

        // Get new token
        const newToken = useAuthStore.getState().token;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
