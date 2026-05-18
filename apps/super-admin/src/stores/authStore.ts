import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAccessToken: (token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set: any, get: any) => ({
      user: null as User | null,
      accessToken: null as string | null,
      isAuthenticated: false as boolean,
      isLoading: false as boolean,

      setAccessToken: (token: string) => set({ accessToken: token }),

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          const user = data.data.user;
          // Ensure only superadmin can log in to the Super Admin Panel
          if (user.role !== 'superadmin') {
            throw new Error('Access denied. Super Administrator privileges required.');
          }
          set({
            user,
            accessToken: data.data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.error || error.message || 'Login failed');
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {}
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        if (!get().accessToken) return;
        try {
          const { data } = await api.get('/auth/me');
          if (data.data.role !== 'superadmin') {
            throw new Error('Unauthorized');
          }
          set({ user: data.data, isAuthenticated: true });
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'vexo-super-admin-auth',
      partialize: (state: any) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
