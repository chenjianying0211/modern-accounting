import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  Alert,
  LinearProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Description as CsvIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as ReportsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { reportApi } from '../utils/api';
import { LineChart, PieChart } from '@mui/x-charts';

// 報告數據類型
interface ReportData {
  summary: {
    totalInvoices: number;
    totalAmount: number;
    averageAmount: number;
    categoryBreakdown: Array<{
      category: string;
      amount: number;
      count: number;
      percentage: number;
    }>;
  };
  monthlyTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  invoiceList: Array<{
    id: string;
    invoiceNumber: string;
    date: string;
    vendor: string;
    category: string;
    amount: number;
    status: string;
  }>;
}

const ReportsPage: React.FC = () => {
  // 狀態管理
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 篩選條件
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(dayjs().subtract(3, 'month'));
  const [dateTo, setDateTo] = useState<Dayjs | null>(dayjs());
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 載入報告數據
  const loadReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        dateFrom: dateFrom?.format('YYYY-MM-DD') || '',
        dateTo: dateTo?.format('YYYY-MM-DD') || '',
        category: category || undefined,
        department: department || undefined,
      };

      const response = await reportApi.getReportData(params);

      if (response.success) {
        setReportData(response.data);
      } else {
        // 使用模擬數據
        setReportData(getMockReportData());
      }
    } catch (err) {
      console.error('Load report data error:', err);
      // 使用模擬數據
      setReportData(getMockReportData());
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, category, department]);

  // 模擬數據
  const getMockReportData = (): ReportData => {
    return {
      summary: {
        totalInvoices: 245,
        totalAmount: 1250000,
        averageAmount: 5102,
        categoryBreakdown: [
          { category: '辦公用品', amount: 350000, count: 85, percentage: 28 },
          { category: '差旅費', amount: 300000, count: 65, percentage: 24 },
          { category: '餐飲費', amount: 250000, count: 120, percentage: 20 },
          { category: '設備費', amount: 200000, count: 15, percentage: 16 },
          { category: '其他', amount: 150000, count: 60, percentage: 12 },
        ],
      },
      monthlyTrend: [
        { month: '8月', amount: 380000, count: 78 },
        { month: '9月', amount: 420000, count: 82 },
        { month: '10月', amount: 450000, count: 85 },
      ],
      invoiceList: [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          date: '2024-11-10',
          vendor: '台灣科技股份有限公司',
          category: '辦公用品',
          amount: 1450,
          status: 'completed',
        },
        {
          id: '2',
          invoiceNumber: 'RCP-2024-002',
          date: '2024-11-09',
          vendor: '便利商店股份有限公司',
          category: '餐飲費',
          amount: 210,
          status: 'completed',
        },
        {
          id: '3',
          invoiceNumber: 'INV-2024-003',
          date: '2024-11-08',
          vendor: '電腦設備有限公司',
          category: '設備費',
          amount: 25800,
          status: 'completed',
        },
        {
          id: '4',
          invoiceNumber: 'RCP-2024-004',
          date: '2024-11-07',
          vendor: '加油站股份有限公司',
          category: '差旅費',
          amount: 850,
          status: 'completed',
        },
        {
          id: '5',
          invoiceNumber: 'INV-2024-005',
          date: '2024-11-06',
          vendor: '文具用品有限公司',
          category: '辦公用品',
          amount: 680,
          status: 'completed',
        },
      ],
    };
  };

  // 初始載入
  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // 匯出報告
  const handleExportReport = async (format: 'excel' | 'csv' | 'pdf') => {
    try {
      const params = {
        dateFrom: dateFrom?.format('YYYY-MM-DD') || '',
        dateTo: dateTo?.format('YYYY-MM-DD') || '',
        category: category || undefined,
        department: department || undefined,
      };

      const blob = await reportApi.exportReport(format, params);
      
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${dayjs().format('YYYY-MM-DD')}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('匯出失敗，請稍後再試');
      }
    } catch (err) {
      console.error('Export report error:', err);
      setError('匯出過程中發生錯誤');
    }
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

  // 篩選後的發票列表
  const filteredInvoices = reportData?.invoiceList.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {/* 標題 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            報告分析
          </Typography>
          <Typography variant="body1" color="text.secondary">
            查看發票統計數據和分析報告
          </Typography>
        </Box>

        {/* 篩選區域 */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <ReportsIcon sx={{ mr: 1 }} />
              報告篩選
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="開始日期"
                  value={dateFrom}
                  onChange={(newValue: Dayjs | null) => setDateFrom(newValue)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <DatePicker
                  label="結束日期"
                  value={dateTo}
                  onChange={(newValue: Dayjs | null) => setDateTo(newValue)}
                  slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>類別</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="類別"
                  >
                    <MenuItem value="">全部</MenuItem>
                    <MenuItem value="辦公用品">辦公用品</MenuItem>
                    <MenuItem value="差旅費">差旅費</MenuItem>
                    <MenuItem value="餐飲費">餐飲費</MenuItem>
                    <MenuItem value="設備費">設備費</MenuItem>
                    <MenuItem value="其他">其他</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>部門</InputLabel>
                  <Select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    label="部門"
                  >
                    <MenuItem value="">全部</MenuItem>
                    <MenuItem value="財務部">財務部</MenuItem>
                    <MenuItem value="人事部">人事部</MenuItem>
                    <MenuItem value="IT部">IT部</MenuItem>
                    <MenuItem value="行銷部">行銷部</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={loadReportData}
                  disabled={loading}
                  sx={{ backgroundColor: '#1E3A8A' }}
                >
                  {loading ? '載入中...' : '生成報告'}
                </Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadReportData}
                  disabled={loading}
                >
                  重新整理
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* 載入狀態 */}
        {loading && <LinearProgress sx={{ mb: 3 }} />}

        {/* 錯誤訊息 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 報告內容 */}
        {reportData && (
          <>
            {/* 摘要卡片 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#1E3A8A' }}>
                          {reportData.summary.totalInvoices}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          總發票數
                        </Typography>
                      </Box>
                      <TrendingUpIcon sx={{ fontSize: 40, color: '#1E3A8A' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#059669' }}>
                          ${(reportData.summary.totalAmount / 1000).toFixed(0)}K
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          總金額
                        </Typography>
                      </Box>
                      <TrendingUpIcon sx={{ fontSize: 40, color: '#059669' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" component="div" sx={{ fontWeight: 600, color: '#DC2626' }}>
                          ${reportData.summary.averageAmount.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          平均金額
                        </Typography>
                      </Box>
                      <TrendingUpIcon sx={{ fontSize: 40, color: '#DC2626' }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Tooltip title="匯出 Excel">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleExportReport('excel')}
                        >
                          <ExcelIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="匯出 CSV">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleExportReport('csv')}
                        >
                          <CsvIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="匯出 PDF">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleExportReport('pdf')}
                        >
                          <PdfIcon />
                        </Button>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      匯出報告
                    </Typography>
                  </CardContent>
                </Card>
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
                          data: reportData.monthlyTrend.map(d => d.month) 
                        }]}
                        series={[{
                          data: reportData.monthlyTrend.map(d => d.amount),
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
                          data: reportData.summary.categoryBreakdown.map((item, index) => ({
                            id: index,
                            value: item.percentage,
                            label: item.category
                          }))
                        }]}
                        height={250}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* 類別明細表 */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  類別明細
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>類別</TableCell>
                        <TableCell align="right">金額</TableCell>
                        <TableCell align="center">發票數量</TableCell>
                        <TableCell align="center">佔比</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.summary.categoryBreakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell align="right">
                            ${item.amount.toLocaleString()}
                          </TableCell>
                          <TableCell align="center">{item.count}</TableCell>
                          <TableCell align="center">{item.percentage}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* 發票明細列表 */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    發票明細
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="搜尋發票號碼或廠商..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 250 }}
                  />
                </Box>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>發票號碼</TableCell>
                        <TableCell>日期</TableCell>
                        <TableCell>廠商</TableCell>
                        <TableCell>類別</TableCell>
                        <TableCell align="right">金額</TableCell>
                        <TableCell align="center">狀態</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id} hover>
                          <TableCell>{invoice.invoiceNumber}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.vendor}</TableCell>
                          <TableCell>
                            <Chip label={invoice.category} variant="outlined" size="small" />
                          </TableCell>
                          <TableCell align="right">
                            ${invoice.amount.toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            <StatusChip status={invoice.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default ReportsPage;