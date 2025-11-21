import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/login',
}) => {
  const { user, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  // 未登入，重導向到登入頁面
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // 檢查角色權限
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      // 沒有足夠權限，重導向到無權限頁面或儀表板
      return (
        <Navigate
          to="/unauthorized"
          state={{ from: location, requiredRoles }}
          replace
        />
      );
    }
  }

  // 權限檢查通過，顯示子組件
  return <>{children}</>;
};

// 無權限頁面組件
export const UnauthorizedPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as any;
  const requiredRoles = state?.requiredRoles as string[] | undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography variant="h1" color="error" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
        403
      </Typography>
      <Typography variant="h4" gutterBottom>
        權限不足
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        抱歉，您沒有足夠的權限訪問此頁面。
      </Typography>
      
      {user && (
        <Typography variant="body2" color="text.secondary" paragraph>
          您的角色：{user.role}
        </Typography>
      )}
      
      {requiredRoles && (
        <Typography variant="body2" color="text.secondary" paragraph>
          需要的角色：{requiredRoles.join(', ')}
        </Typography>
      )}

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
        >
          返回上一頁
        </Button>
      </Box>
    </Box>
  );
};

export default ProtectedRoute;