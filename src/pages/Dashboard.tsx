import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  AttachMoney as MoneyIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { LineChart, PieChart } from '@mui/x-charts';
import { useAuth } from '../contexts/AuthContext';
import { dashboardApi } from '../utils/api';

// 儀表板數據類型
interface DashboardSummary {
  totalInvoices: number;
  ocrSuccessRate: number;
  totalAmount: number;
  pendingCount: number;
  monthlyData: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentInvoices: Array<{
    id: string;
    fileName: string;
    uploadDate: string;
    status: string;
    amount: number;
  }>;
}

// KPI 卡片組件
const KPICard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
}> = ({ title, value, subtitle, icon, color, trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600, color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              backgroundColor: `${color}20`,
              color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
        {trend !== undefined && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon 
              sx={{ 
                fontSize: 16, 
                mr: 0.5, 
                color: trend >= 0 ? 'success.main' : 'error.main' 
              }} 
            />
            <Typography 
              variant="caption" 
              sx={{ color: trend >= 0 ? 'success.main' : 'error.main' }}
            >
              {trend >= 0 ? '+' : ''}{trend}% 較上月
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// 狀態標籤組件
const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    processing: { label: '處理中', color: 'warning' as const },
    completed: { label: '已完成', color: 'success' as const },
    error: { label: '錯誤', color: 'error' as const },
    pending: { label: '待處理', color: 'default' as const },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return <Chip label={config.label} color={config.color} size="small" />;
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入儀表板數據
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getSummary();
        
        if (response.success) {
          setDashboardData(response.data);
        } else {
          // 使用模擬數據
          setDashboardData(getMockData());
        }
      } catch (err) {
        console.error('Load dashboard data error:', err);
        // 使用模擬數據
        setDashboardData(getMockData());
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 模擬數據（當 API 不可用時）
  const getMockData = (): DashboardSummary => {
    return {
      totalInvoices: 1248,
      ocrSuccessRate: 95.2,
      totalAmount: 2845678,
      pendingCount: 12,
      monthlyData: [
        { month: '1月', amount: 180000, count: 85 },
        { month: '2月', amount: 220000, count: 102 },
        { month: '3月', amount: 310000, count: 128 },
        { month: '4月', amount: 285000, count: 115 },
        { month: '5月', amount: 350000, count: 145 },
        { month: '6月', amount: 420000, count: 178 },
      ],
      categoryData: [
        { name: '辦公用品', value: 35, color: '#8884d8' },
        { name: '差旅費', value: 28, color: '#82ca9d' },
        { name: '餐飲費', value: 20, color: '#ffc658' },
        { name: '設備費', value: 12, color: '#ff7c7c' },
        { name: '其他', value: 5, color: '#8dd1e1' },
      ],
      recentInvoices: [
        {
          id: '1',
          fileName: 'invoice_001.pdf',
          uploadDate: '2024-11-10',
          status: 'completed',
          amount: 1280,
        },
        {
          id: '2',
          fileName: 'receipt_002.jpg',
          uploadDate: '2024-11-09',
          status: 'processing',
          amount: 850,
        },
        {
          id: '3',
          fileName: 'invoice_003.pdf',
          uploadDate: '2024-11-08',
          status: 'completed',
          amount: 2150,
        },
        {
          id: '4',
          fileName: 'receipt_004.png',
          uploadDate: '2024-11-07',
          status: 'error',
          amount: 0,
        },
        {
          id: '5',
          fileName: 'invoice_005.pdf',
          uploadDate: '2024-11-06',
          status: 'completed',
          amount: 3200,
        },
      ],
    };
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        暫無數據
      </Alert>
    );
  }

  return (
    <Box>
      {/* 歡迎訊息 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          歡迎回來，{user?.name}！
        </Typography>
        <Typography variant="body1" color="text.secondary">
          以下是您的系統概覽和最新活動
        </Typography>
      </Box>

      {/* KPI 卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="總發票數"
            value={dashboardData.totalInvoices.toLocaleString()}
            subtitle="本月新增 +45"
            icon={<ReceiptIcon />}
            color="#1E3A8A"
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="OCR 識別率"
            value={`${dashboardData.ocrSuccessRate}%`}
            subtitle="準確度"
            icon={<CheckCircleIcon />}
            color="#059669"
            trend={2.5}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="總金額"
            value={`$${(dashboardData.totalAmount / 1000).toFixed(0)}K`}
            subtitle="本年度累計"
            icon={<MoneyIcon />}
            color="#DC2626"
            trend={8.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <KPICard
            title="待處理"
            value={dashboardData.pendingCount.toString()}
            subtitle="需要審核"
            icon={<PendingIcon />}
            color="#D97706"
            trend={-15}
          />
        </Grid>
      </Grid>

      {/* 圖表區域 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 月度趨勢圖 */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                月度支出趨勢
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <LineChart
                  xAxis={[{ 
                    scaleType: 'point', 
                    data: dashboardData.monthlyData.map(d => d.month) 
                  }]}
                  series={[{
                    data: dashboardData.monthlyData.map(d => d.amount),
                    label: '金額',
                    color: '#1E3A8A'
                  }]}
                  height={300}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 類別分布圖 */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                支出類別分布
              </Typography>
              <Box sx={{ width: '100%', height: 250 }}>
                <PieChart
                  series={[{
                    data: dashboardData.categoryData.map((item, index) => ({
                      id: index,
                      value: item.value,
                      label: item.name,
                      color: item.color
                    }))
                  }]}
                  height={250}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 最近發票列表 */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            最近上傳的發票
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>檔案名稱</TableCell>
                  <TableCell>上傳日期</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell align="right">金額</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {invoice.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.uploadDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={invoice.status} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {invoice.amount > 0 ? `$${invoice.amount.toLocaleString()}` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="查看詳情">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;