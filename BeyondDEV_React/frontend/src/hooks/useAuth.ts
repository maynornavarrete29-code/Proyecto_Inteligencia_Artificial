/**
 * Zustand Auth Store
 */
import create from 'zustand';
import { User } from '@/types';
import { authService } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verify: (email: string, token: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getStoredUser(),
  token: authService.getToken(),
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register(name, email, password);
      set({ user: response.user, token: response.access_token, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({ user: response.user, token: response.access_token, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  verify: async (email, token) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.verify(email, token);
      set({ user: response.user, token: response.access_token, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null });
  },

  loadUser: () => {
    const user = authService.getStoredUser();
    const token = authService.getToken();
    set({ user, token });
  },
}));
