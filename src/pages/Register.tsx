import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Container,
} from '@mui/material';
import {
  AccountBalance as LogoIcon,
} from '@mui/icons-material';

const RegisterPage: React.FC = () => {
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
              註冊功能暫未開放
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              目前系統僅提供測試帳號登入
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請使用提供的測試帳號進行體驗
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/login"
            fullWidth
            variant="contained"
            sx={{ py: 1.5 }}
          >
            返回登入頁面
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;