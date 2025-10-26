import { create } from "zustand";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export type PostTypes = {
  id: string;
  userId: string;
  description: string;
  url: string;
  createdAt: Date;
};

type usePostStoreTypes = {
  posts: PostTypes[] | null;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPosts: (data: PostTypes) => Promise<void>;
  deletePosts: (id: string) => Promise<void>;
  updatePosts: (id: string, data: Partial<PostTypes>) => Promise<void>;
};

export const usePostStore = create<usePostStoreTypes>((set, get) => ({
  posts: [],
  error: null,

  fetchPosts: async () => {
    try {
      const response = await api.get<PostTypes[]>("/posts");
      set({ posts: response.data, error: null });
    } catch (e: any) {
      console.log(e);
      set({ error: e.message });
    }
  },

  addPosts: async (data: PostTypes) => {
    try {
      const response = await api.post<PostTypes>("/posts", data);
      set({ posts: [...(get().posts || []), response.data] });
    } catch (e: any) {
      console.log(e);
      set({ error: e.message });
    }
  },

  deletePosts: async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);
      set({ posts: (get().posts || []).filter((post) => post.id !== id) });
    } catch (e: any) {
      console.log(e);
      set({ error: e.message });
    }
  },

  updatePosts: async (id: string, data: Partial<PostTypes>) => {
    try {
      const response = await api.put<PostTypes>(`/posts/${id}`, data);
      set({
        posts: (get().posts || []).map((post) =>
          post.id === id ? response.data : post
        ),
      });
    } catch (e: any) {
      console.log(e);
      set({ error: e.message });
    }
  },
}));

//user data for Main page
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

export const usePosterStore = create<UserStoreTypes>((set) => ({
  user: null,
  error: null,

  getUser: async (id: string) => {
    try {
      const res = await api.post("/user", { id });

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

//liking and disliking a post
type Likes = {
  id: string;
  portfolioId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type UseReactionStore = {
  likes: Likes[];
  error: null | string | unknown;
  addLike: (data: Data) => Promise<void>;
  removeLike: (data: Data) => Promise<void>;
};

type Data = {
  id: string;
  userId: string;
};

const UseReactionStore = create<UseReactionStore>((set, get) => ({
  likes: [],
  error: null,
  addLike: async (data: Data) => {
    try {
      const { id, userId } = data;
      const res = await axios.post(`/likes/${id}`, userId);
      set({ error: null });
      return res.data;
    } catch (e) {
      console.log(e);
      set({ error: e });
    }
  },
  removeLike: async (data: Data) => {
    try {
      const { id, userId } = data;
      const res = await axios.delete(`/likes/${id}`, { data: { userId } });
      set({ error: null });
      return res.data;
    } catch (e) {
      console.log(e);
      set({ error: e });
    }
  },
}));
