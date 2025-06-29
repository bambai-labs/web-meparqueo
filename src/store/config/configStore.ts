import { create } from 'zustand';
import { UpdateVersionDto, UpdateBannerDto } from './types';
import api from '../../service/api';
import { API_ENDPOINTS, ApiResponse } from '../../types/api';
import { extractErrorMessage } from '../helpers';
import { VersionConfig, BannerConfig } from '../models';

interface ConfigStore {
  version: VersionConfig | null;
  banner: BannerConfig | null;
  loading: {
    getVersion: boolean;
    updateVersion: boolean;
    getBanner: boolean;
    updateBanner: boolean;
  };
  errors: string[];
  getVersion: () => Promise<VersionConfig>;
  updateVersion: (dto: UpdateVersionDto) => Promise<VersionConfig>;
  getBanner: () => Promise<BannerConfig>;
  updateBanner: (dto: UpdateBannerDto) => Promise<BannerConfig>;
  resetState: () => void;
  clearError: () => void;
}

export const useConfigStore = create<ConfigStore>((set) => ({
  version: null,
  banner: null,
  loading: {
    getVersion: false,
    updateVersion: false,
    getBanner: false,
    updateBanner: false,
  },
  errors: [],
  getVersion: async () => {
    set((state) => ({
      loading: { ...state.loading, getVersion: true },
      errors: [],
    }));
    try {
      const response = await api.get<ApiResponse<VersionConfig>>(
        API_ENDPOINTS.config.version.get,
      );
      const version = response.data.data;
      set((state) => ({
        version,
        loading: { ...state.loading, getVersion: false },
      }));
      return version;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, getVersion: false },
      }));
      throw new Error(errMsg);
    }
  },
  updateVersion: async (dto: UpdateVersionDto) => {
    set((state) => ({
      loading: { ...state.loading, updateVersion: true },
      errors: [],
    }));
    try {
      const response = await api.patch<ApiResponse<VersionConfig>>(
        API_ENDPOINTS.config.version.update,
        dto,
      );
      const updatedVersion = response.data.data;
      set((state) => ({
        version: updatedVersion,
        loading: { ...state.loading, updateVersion: false },
      }));
      return updatedVersion;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, updateVersion: false },
      }));
      throw new Error(errMsg);
    }
  },
  getBanner: async () => {
    set((state) => ({
      loading: { ...state.loading, getBanner: true },
      errors: [],
    }));
    try {
      const response = await api.get<ApiResponse<BannerConfig>>(
        API_ENDPOINTS.config.banner.get,
      );
      const banner = response.data.data;
      set((state) => ({
        banner,
        loading: { ...state.loading, getBanner: false },
      }));
      return banner;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, getBanner: false },
      }));
      throw new Error(errMsg);
    }
  },
  updateBanner: async (dto: UpdateBannerDto) => {
    set((state) => ({
      loading: { ...state.loading, updateBanner: true },
      errors: [],
    }));
    try {
      const response = await api.patch<ApiResponse<BannerConfig>>(
        API_ENDPOINTS.config.banner.update,
        dto,
      );
      const updatedBanner = response.data.data;
      set((state) => ({
        banner: updatedBanner,
        loading: { ...state.loading, updateBanner: false },
      }));
      return updatedBanner;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, updateBanner: false },
      }));
      throw new Error(errMsg);
    }
  },
  resetState: () => {
    set(() => ({
      version: null,
      banner: null,
      loading: {
        getVersion: false,
        updateVersion: false,
        getBanner: false,
        updateBanner: false,
      },
      errors: [],
    }));
  },
  clearError: () => {
    set(() => ({
      errors: [],
    }));
  },
})); 