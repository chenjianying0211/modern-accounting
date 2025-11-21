import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/zh-tw';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute, { UnauthorizedPage } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar/Sidebar';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DashboardPage from './pages/Dashboard';
import InvoiceListPage from './pages/Invoices/List';
import InvoiceUploadPage from './pages/Invoices/Upload';
import InvoiceDetailPage from './pages/Invoices/Detail';
import ReportsPage from './pages/Reports';
import CategoriesPage from './pages/Settings/Categories';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E3A8A',
      light: '#3B82F6',
      dark: '#1E40AF',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#F9FAFB',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans TC", "Microsoft JhengHei", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <Sidebar>{children}</Sidebar>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute requiredRoles={['uploader', 'accountant', 'admin']}>
                    <MainLayout>
                      <InvoiceListPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices/upload"
                element={
                  <ProtectedRoute requiredRoles={['uploader', 'accountant', 'admin']}>
                    <MainLayout>
                      <InvoiceUploadPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices/:id"
                element={
                  <ProtectedRoute requiredRoles={['uploader', 'accountant', 'admin']}>
                    <MainLayout>
                      <InvoiceDetailPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute requiredRoles={['accountant', 'admin']}>
                    <MainLayout>
                      <ReportsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/categories"
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <MainLayout>
                      <CategoriesPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
