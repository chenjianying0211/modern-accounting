// API 工具函數
import axios, { AxiosResponse, AxiosError } from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/auth';

// API 基礎 URL（環境變數或預設值）
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// 創建 axios 實例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：添加 Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理錯誤和 token 過期
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token 過期或無效，清除本地存儲並重導向到登入頁面
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 認證 API
export const authApi = {
  // 登入
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: '登入失敗，請檢查您的帳號密碼',
      };
    }
  },

  // 註冊
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: '註冊失敗，請稍後再試',
      };
    }
  },

  // 驗證 token 並取得用戶資訊
  async verifyToken(): Promise<{ user: User | null }> {
    try {
      const response: AxiosResponse<{ user: User }> = await apiClient.get('/auth/verify');
      return { user: response.data.user };
    } catch (error) {
      console.error('Token verification error:', error);
      return { user: null };
    }
  },

  // 刷新 token
  async refreshToken(): Promise<{ token: string | null }> {
    try {
      const response: AxiosResponse<{ token: string }> = await apiClient.post('/auth/refresh');
      return { token: response.data.token };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { token: null };
    }
  },
};

// 通用 API 響應類型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 發票 API
export const invoiceApi = {
  // 上傳發票
  async uploadInvoice(file: File): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('invoice', file);
    
    try {
      const response = await apiClient.post('/invoices/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        message: '發票上傳失敗',
      };
    }
  },

  // 取得發票列表
  async getInvoices(params: {
    page?: number;
    limit?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  } = {}): Promise<ApiResponse> {
    try {
      const response = await apiClient.get('/invoices', { params });
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      return {
        success: false,
        message: '取得發票列表失敗',
      };
    }
  },

  // 取得單一發票詳情
  async getInvoiceDetail(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice detail error:', error);
      return {
        success: false,
        message: '取得發票詳情失敗',
      };
    }
  },

  // 刪除發票
  async deleteInvoice(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete invoice error:', error);
      return {
        success: false,
        message: '刪除發票失敗',
      };
    }
  },
};

// 儀表板 API
export const dashboardApi = {
  // 取得儀表板摘要資訊
  async getSummary(): Promise<ApiResponse> {
    try {
      const response = await apiClient.get('/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Get dashboard summary error:', error);
      return {
        success: false,
        message: '取得儀表板資訊失敗',
      };
    }
  },

  // 取得圖表資料
  async getChartData(type: string, params: any = {}): Promise<ApiResponse> {
    try {
      const response = await apiClient.get(`/dashboard/charts/${type}`, { params });
      return response.data;
    } catch (error) {
      console.error('Get chart data error:', error);
      return {
        success: false,
        message: '取得圖表資料失敗',
      };
    }
  },
};

// 報告 API
export const reportApi = {
  // 取得報告資料
  async getReportData(params: {
    dateFrom: string;
    dateTo: string;
    category?: string;
    department?: string;
  }): Promise<ApiResponse> {
    try {
      const response = await apiClient.get('/reports/data', { params });
      return response.data;
    } catch (error) {
      console.error('Get report data error:', error);
      return {
        success: false,
        message: '取得報告資料失敗',
      };
    }
  },

  // 匯出報告
  async exportReport(format: 'excel' | 'csv' | 'pdf', params: any): Promise<Blob | null> {
    try {
      const response = await apiClient.get(`/reports/export/${format}`, {
        params,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Export report error:', error);
      return null;
    }
  },
};

// 設定 API
export const settingsApi = {
  // 取得會計類別
  async getCategories(): Promise<ApiResponse> {
    try {
      const response = await apiClient.get('/settings/categories');
      return response.data;
    } catch (error) {
      console.error('Get categories error:', error);
      return {
        success: false,
        message: '取得會計類別失敗',
      };
    }
  },

  // 建立會計類別
  async createCategory(category: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/settings/categories', category);
      return response.data;
    } catch (error) {
      console.error('Create category error:', error);
      return {
        success: false,
        message: '建立會計類別失敗',
      };
    }
  },

  // 更新會計類別
  async updateCategory(id: string, category: any): Promise<ApiResponse> {
    try {
      const response = await apiClient.put(`/settings/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error('Update category error:', error);
      return {
        success: false,
        message: '更新會計類別失敗',
      };
    }
  },

  // 刪除會計類別
  async deleteCategory(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(`/settings/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete category error:', error);
      return {
        success: false,
        message: '刪除會計類別失敗',
      };
    }
  },
};

export default apiClient;