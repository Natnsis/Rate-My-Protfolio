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
  post: PostTypes | null;
  posts: PostTypes[] | null;
  error: string | null;
  fetchPost: (id: string) => Promise<void>;
  fetchPosts: () => Promise<void>;
  addPosts: (data: PostTypes) => Promise<boolean>;
  deletePosts: (id: string) => Promise<void>;
  updatePosts: (id: string, data: Partial<PostTypes>) => Promise<void>;
};

export const usePostStore = create<usePostStoreTypes>((set, get) => ({
  posts: [],
  post: null,
  error: null,

  fetchPost: async (id: string) => {
    try {
      const response = await api.get<PostTypes>(`/posts/${id}`);
      set({ post: response.data, error: null });
    } catch (e: any) {
      console.log(e);
      set({ error: e.message });
    }
  },

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
      // Put the new post at the beginning
      set({ posts: [response.data, ...(get().posts || [])], error: null });
      return true; // indicate success
    } catch (e: any) {
      console.error("Failed to add post:", e);
      set({ error: e.message });
      return false; // indicate failure
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
  loading: boolean;
  error: string | null;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  getLikes: () => Promise<void>;
};

export const useReactionStore = create<UseReactionStore>((set, get) => ({
  likes: [],
  loading: false,
  error: null,

  getLikes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/likes");
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      set({ likes: data, loading: false });
    } catch (err: any) {
      console.error("getLikes error:", err);
      set({
        error: err?.response?.data?.message || "Failed to load likes",
        loading: false,
      });
    }
  },

  toggleLike: async (postId: string, userId: string) => {
    const prevLikes = get().likes;
    const isLiked = prevLikes.some(
      (like) => like.userId === userId && like.portfolioId === postId
    );

    if (isLiked) {
      set({
        likes: prevLikes.filter(
          (like) => !(like.userId === userId && like.portfolioId === postId)
        ),
      });
    } else {
      const optimisticLike: Likes = {
        id: crypto.randomUUID(),
        portfolioId: postId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({ likes: [...prevLikes, optimisticLike] });
    }

    try {
      if (isLiked) {
        await api.delete(`/likes/${postId}`, { data: { userId } });
      } else {
        await api.post(`/likes/${postId}`, { userId });
      }
    } catch (err: any) {
      console.error("toggleLike sync error:", err);
      set({
        likes: prevLikes,
        error: err?.response?.data?.message || "Failed to toggle like",
      });
    }
  },
}));

//comment store
type Comment = {
  id: string;
  portfolioId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  receiverId: string;
};

type CommentData = {
  content: string;
  userId: string;
  receiverId: string;
};

type UseCommentStore = {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  getComments: (portfolioId: string) => Promise<void>;
  sendComments: (portfolioId: string, data: CommentData) => Promise<void>;
};

export const useCommentStore = create<UseCommentStore>((set) => ({
  comments: [],
  loading: false,
  error: null,

  getComments: async (portfolioId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/comments/${portfolioId}`);
      // Expect backend to return array
      const comments = Array.isArray(res.data) ? res.data : [];
      set({ comments, loading: false });
    } catch (e) {
      console.error("getComments error:", e);
      set({ error: "Failed to fetch comments", loading: false });
    }
  },

  sendComments: async (portfolioId: string, data: CommentData) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/comments/${portfolioId}`, data);
      // refresh comments after sending
      const res = await api.get(`/comments/${portfolioId}`);
      const comments = Array.isArray(res.data) ? res.data : [];
      set({ comments, loading: false });
    } catch (e) {
      console.error("sendComments error:", e);
      set({ error: "Failed to send comment", loading: false });
    }
  },
}));
