import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  Upload as UploadIcon,
  List as ListIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: '上傳發票',
      path: '/upload',
      icon: <UploadIcon />,
    },
    {
      label: '發票列表',
      path: '/list',
      icon: <ListIcon />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 頂部導航欄 */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <ReceiptIcon sx={{ mr: 2 }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ flexGrow: 1, fontWeight: 600 }}
            >
              智能發票辨識系統
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* 主要內容區域 */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 2,
            minHeight: 'calc(100vh - 200px)',
            background: '#fafafa',
          }}
        >
          {children}
        </Paper>
      </Container>

      {/* 底部 */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 智能發票辨識系統. 使用 Material-UI 構建.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;