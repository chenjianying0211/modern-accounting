import React, { createContext, useContext, useState, ReactNode } from 'react';

// 簡化的用戶類型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'uploader';
}

// 登入憑證
export interface LoginCredentials {
  email: string;
  password: string;
}

// 認證上下文類型
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

// 測試用戶數據
const TEST_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '系統管理員',
    role: 'admin'
  },
  {
    id: '2',
    email: 'accountant@example.com',
    name: '會計師',
    role: 'accountant'
  },
  {
    id: '3',
    email: 'uploader@example.com',
    name: '上傳者',
    role: 'uploader'
  }
];

// 測試密碼映射
const TEST_PASSWORDS: Record<string, string> = {
  'admin@example.com': 'admin123',
  'accountant@example.com': 'acc123',
  'uploader@example.com': 'upload123'
};

// 創建認證上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認證提供者組件
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // 初始化：檢查 localStorage 中的用戶資料
  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // 登入函數 - 簡化版本，直接驗證測試帳號
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    const { email, password } = credentials;
    
    // 檢查是否為有效的測試帳號
    if (TEST_PASSWORDS[email] === password) {
      const foundUser = TEST_USERS.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        return true;
      }
    }
    
    return false;
  };

  // 登出函數
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  // 檢查用戶角色
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    
    // 管理員可以訪問所有功能
    if (user.role === 'admin') return true;
    
    // 直接檢查角色匹配
    return user.role === role;
  };

  // 上下文值
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用認證上下文的 Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 檢查是否已登入的 Hook
export const useRequireAuth = (): User => {
  const { user, isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      // 重導向到登入頁面
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  return user!;
};

export default AuthContext;