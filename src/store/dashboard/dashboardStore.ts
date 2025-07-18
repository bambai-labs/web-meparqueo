import { create } from 'zustand';
import api from '../../service/api';
import { ApiResponse } from '../../types/api';
import { extractErrorMessage } from '../helpers';
import { DashboardStats, DashboardUserFrequency } from './types';

interface DashboardStore {
  stats: DashboardStats | null;
  userFrequency: DashboardUserFrequency | null;
  loading: {
    stats: boolean;
    userFrequency: boolean;
  };
  errors: string[];
  getStats: (startDate: string, endDate: string) => Promise<DashboardStats>;
  getUserFrequency: (startDate: string, endDate: string) => Promise<DashboardUserFrequency>;
  resetState: () => void;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: null,
  userFrequency: null,
  loading: {
    stats: false,
    userFrequency: false,
  },
  errors: [],
  getStats: async (startDate: string, endDate: string) => {
    set((state) => ({
      loading: { ...state.loading, stats: true },
      errors: [],
    }));
    try {
      const response =
        await api.get<ApiResponse<DashboardStats>>(
          `/dashboard/stats?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
        );
      const stats = response.data.data;
      set((state) => ({
        stats,
        loading: { ...state.loading, stats: false },
      }));
      return stats;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, stats: false },
      }));
      throw new Error(errMsg);
    }
  },
  getUserFrequency: async (startDate: string, endDate: string) => {
    set((state) => ({
      loading: { ...state.loading, userFrequency: true },
      errors: [],
    }));
    try {
      const response = await api.get<ApiResponse<DashboardUserFrequency>>(
        `/dashboard/user-frequency?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
      );
      const userFrequency = response.data.data;
      set((state) => ({
        userFrequency,
        loading: { ...state.loading, userFrequency: false },
      }));
      return userFrequency;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, userFrequency: false },
      }));
      throw new Error(errMsg);
    }
  },
  resetState: () => {
    set(() => ({
      stats: null,
      userFrequency: null,
      loading: {
        stats: false,
        userFrequency: false,
      },
      errors: [],
    }));
  },
  clearError: () => set({ errors: [] }),
}));
