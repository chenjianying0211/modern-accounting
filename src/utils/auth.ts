// 認證相關工具函數
import { User, UserRole, JWTPayload } from '../types/auth';

// JWT Token 處理
export class AuthUtils {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

  // 儲存 token 和用戶資料到 localStorage
  static saveAuth(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // 從 localStorage 取得 token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 從 localStorage 取得用戶資料
  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error('Parse user data error:', error);
        this.clearAuth();
        return null;
      }
    }
    return null;
  }

  // 清除認證資料
  static clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // 檢查是否已登入
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // 檢查 token 是否過期
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearAuth();
      return false;
    }
  }

  // 解碼 JWT token（僅用於檢查，不驗證簽名）
  static decodeToken(token: string): JWTPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token format');
    }
  }

  // 檢查用戶是否有指定角色
  static hasRole(user: User | null, role: UserRole): boolean {
    return user?.role === role;
  }

  // 檢查用戶是否有任一指定角色
  static hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    return user ? roles.includes(user.role) : false;
  }

  // 取得 token 剩餘有效時間（秒）
  static getTokenTimeLeft(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      return 0;
    }
  }

  // 檢查是否需要刷新 token（剩餘時間少於 5 分鐘）
  static shouldRefreshToken(): boolean {
    const timeLeft = this.getTokenTimeLeft();
    return timeLeft > 0 && timeLeft < 300; // 5 分鐘
  }
}

// 角色權限配置
export const ROLE_PERMISSIONS = {
  uploader: {
    canUploadInvoices: true,
    canViewOwnInvoices: true,
    canViewAllInvoices: false,
    canViewReports: false,
    canManageUsers: false,
    canManageSettings: false,
  },
  accountant: {
    canUploadInvoices: true,
    canViewOwnInvoices: true,
    canViewAllInvoices: true,
    canViewReports: true,
    canManageUsers: false,
    canManageSettings: false,
  },
  admin: {
    canUploadInvoices: true,
    canViewOwnInvoices: true,
    canViewAllInvoices: true,
    canViewReports: true,
    canManageUsers: true,
    canManageSettings: true,
  },
} as const;

// 檢查用戶權限
export function hasPermission(user: User | null, permission: keyof typeof ROLE_PERMISSIONS.admin): boolean {
  if (!user) return false;
  return ROLE_PERMISSIONS[user.role][permission] || false;
}

// 角色顯示名稱
export const ROLE_LABELS = {
  uploader: '上傳者',
  accountant: '會計師',
  admin: '系統管理員',
} as const;

// 格式化用戶顯示名稱
export function formatUserRole(role: UserRole): string {
  return ROLE_LABELS[role] || role;
}

// 密碼強度檢查
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密碼長度至少需要 8 個字元');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密碼須包含至少一個大寫字母');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密碼須包含至少一個小寫字母');
  }

  if (!/\d/.test(password)) {
    errors.push('密碼須包含至少一個數字');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email 格式檢查
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}