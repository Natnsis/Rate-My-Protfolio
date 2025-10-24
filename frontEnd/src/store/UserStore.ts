import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 10000, 
});

export type UserData = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

type UserStoreTypes = {
  user: UserData | null;
  error: string | null;
  getUser: (id: string) => Promise<UserData | null>;
};

export const useUserStore = create<UserStoreTypes>((set) => ({
  user: null,
  error: null,

  getUser: async (id: string) => {
    try {
      const res = await api.post("/api/v1/user", { id });

      if (res.status === 200 && res.data) {
        set({ user: res.data, error: null });
        return res.data;
      } else {
        const msg = "Failed to fetch user data.";
        set({ error: msg });
        return null;
      }
    } catch (err: any) {
      console.error("getUser error:", err);
      set({
        error: err?.response?.data?.message || "An unexpected error occurred.",
      });
      return null;
    }
  },
}));