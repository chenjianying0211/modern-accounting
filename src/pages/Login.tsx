import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Divider,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  AccountBalance as LogoIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  // 如果已經登入，重導向到儀表板
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // 表單狀態
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 從 location state 取得重導向路徑
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // 測試帳號資料
  const testAccounts = [
    { email: 'admin@example.com', password: 'admin123', role: '管理員', color: 'error' as const },
    { email: 'accountant@example.com', password: 'acc123', role: '會計師', color: 'warning' as const },
    { email: 'uploader@example.com', password: 'upload123', role: '上傳者', color: 'success' as const },
  ];

  // 處理輸入變更
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 清除錯誤訊息
    if (error) setError('');
  };

  // 切換密碼顯示
  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // 快速填入測試帳號
  const fillTestAccount = (email: string, password: string) => {
    setFormData({ email, password });
    if (error) setError('');
  };

  // 處理表單提交
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('請輸入完整的登入資訊');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const success = await login(formData);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('帳號或密碼錯誤，請檢查後重試');
      }
    } catch (err) {
      setError('登入過程中發生錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
      }}
    >
      <Card
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 480,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* 標題區域 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LogoIcon
              sx={{
                fontSize: 48,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              歡迎回來
            </Typography>
            <Typography variant="body1" color="text.secondary">
              登入您的會計管理系統
            </Typography>
          </Box>

          {/* 測試帳號快速選擇 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              測試帳號（點擊快速填入）：
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {testAccounts.map((account) => (
                <Chip
                  key={account.email}
                  label={`${account.role}`}
                  color={account.color}
                  variant="outlined"
                  clickable
                  onClick={() => fillTestAccount(account.email, account.password)}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>

          {/* 錯誤訊息 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 登入表單 */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              name="email"
              label="電子郵件"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              name="password"
              label="密碼"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
              }}
            >
              {isSubmitting ? '登入中...' : '登入'}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                或
              </Typography>
            </Divider>

            <Button
              component={Link}
              to="/register"
              fullWidth
              variant="outlined"
              sx={{ py: 1.5 }}
            >
              註冊新帳號
            </Button>
          </Box>

          {/* 測試帳號資訊 */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              測試帳號資訊：
            </Typography>
            {testAccounts.map((account) => (
              <Typography key={account.email} variant="caption" color="text.secondary" display="block">
                {account.role}: {account.email} / {account.password}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;