import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileDownload as DownloadIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { invoiceApi } from '../../utils/api';
import { Invoice } from '../../types/invoice';

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

const InvoiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  // 狀態管理
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 載入發票列表
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await invoiceApi.getInvoices({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter || undefined,
      });

      if (response.success) {
        setInvoices(response.data.items || []);
        setTotalCount(response.data.total || 0);
      } else {
        // 使用模擬資料
        const mockInvoices = getMockInvoices();
        setInvoices(mockInvoices);
        setTotalCount(mockInvoices.length);
      }
    } catch (err) {
      console.error('Load invoices error:', err);
      // 使用模擬資料
      const mockInvoices = getMockInvoices();
      setInvoices(mockInvoices);
      setTotalCount(mockInvoices.length);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, statusFilter]);

  // 模擬資料
  const getMockInvoices = (): Invoice[] => {
    return [
      {
        id: '1',
        fileName: 'invoice_2024001.pdf',
        fileSize: 1024000,
        uploadDate: new Date('2024-11-10'),
        status: 'completed',
        ocrResult: {
          invoiceNumber: 'INV-2024-001',
          date: '2024-11-10',
          seller: {
            name: '台灣科技股份有限公司',
            taxId: '12345678',
            address: '台北市信義區信義路五段7號',
          },
          items: [
            { description: '辦公用品', quantity: 5, unitPrice: 200, amount: 1000 },
            { description: '文具用品', quantity: 3, unitPrice: 150, amount: 450 },
          ],
          totalAmount: 1450,
          taxAmount: 72.5,
          confidence: 0.95,
        },
      },
      {
        id: '2',
        fileName: 'receipt_2024002.jpg',
        fileSize: 512000,
        uploadDate: new Date('2024-11-09'),
        status: 'processing',
      },
      {
        id: '3',
        fileName: 'invoice_2024003.pdf',
        fileSize: 2048000,
        uploadDate: new Date('2024-11-08'),
        status: 'error',
      },
      {
        id: '4',
        fileName: 'receipt_2024004.png',
        fileSize: 768000,
        uploadDate: new Date('2024-11-07'),
        status: 'completed',
        ocrResult: {
          invoiceNumber: 'RCP-2024-004',
          date: '2024-11-07',
          seller: {
            name: '便利商店股份有限公司',
            taxId: '87654321',
            address: '台北市大安區敦化南路二段265號',
          },
          items: [
            { description: '便當', quantity: 2, unitPrice: 80, amount: 160 },
            { description: '飲料', quantity: 2, unitPrice: 25, amount: 50 },
          ],
          totalAmount: 210,
          taxAmount: 10.5,
          confidence: 0.88,
        },
      },
      {
        id: '5',
        fileName: 'invoice_2024005.pdf',
        fileSize: 1536000,
        uploadDate: new Date('2024-11-06'),
        status: 'completed',
        ocrResult: {
          invoiceNumber: 'INV-2024-005',
          date: '2024-11-06',
          seller: {
            name: '電腦設備有限公司',
            taxId: '11223344',
            address: '新北市板橋區中山路一段3號',
          },
          items: [
            { description: '筆記型電腦', quantity: 1, unitPrice: 25000, amount: 25000 },
            { description: '滑鼠', quantity: 1, unitPrice: 800, amount: 800 },
          ],
          totalAmount: 25800,
          taxAmount: 1290,
          confidence: 0.97,
        },
      },
    ];
  };

  useEffect(() => {
    loadInvoices();
  }, [page, rowsPerPage, statusFilter, loadInvoices]);

  // 篩選發票
  const filteredInvoices = invoices.filter(invoice =>
    invoice.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.ocrResult?.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 處理頁面變更
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // 處理每頁行數變更
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 處理搜尋
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 處理狀態篩選
  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // 查看發票詳情
  const handleViewInvoice = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  // 編輯發票
  const handleEditInvoice = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}/edit`);
  };

  // 刪除發票
  const handleDeleteInvoice = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDeleteDialogOpen(true);
  };

  // 確認刪除
  const confirmDelete = async () => {
    if (!selectedInvoice) return;

    try {
      const response = await invoiceApi.deleteInvoice(selectedInvoice.id);
      if (response.success) {
        setInvoices(prev => prev.filter(inv => inv.id !== selectedInvoice.id));
        setDeleteDialogOpen(false);
        setSelectedInvoice(null);
      } else {
        setError(response.message || '刪除失敗');
      }
    } catch (err) {
      setError('刪除發票時發生錯誤');
    }
  };

  // 格式化檔案大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Box>
      {/* 標題和操作按鈕 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          發票管理
        </Typography>
        {hasRole('uploader') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/invoices/upload')}
            sx={{
              backgroundColor: '#1E3A8A',
              '&:hover': { backgroundColor: '#1E40AF' },
            }}
          >
            上傳發票
          </Button>
        )}
      </Box>

      {/* 搜尋和篩選 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="搜尋檔案名稱或發票號碼..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>狀態篩選</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  label="狀態篩選"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="pending">待處理</MenuItem>
                  <MenuItem value="processing">處理中</MenuItem>
                  <MenuItem value="completed">已完成</MenuItem>
                  <MenuItem value="error">錯誤</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadInvoices}
              >
                重新整理
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 發票列表 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading && <LinearProgress />}
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>檔案名稱</TableCell>
                  <TableCell>檔案大小</TableCell>
                  <TableCell>上傳日期</TableCell>
                  <TableCell>狀態</TableCell>
                  <TableCell>發票號碼</TableCell>
                  <TableCell align="right">金額</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {invoice.fileName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatFileSize(invoice.fileSize)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.uploadDate.toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={invoice.status} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {invoice.ocrResult?.invoiceNumber || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {invoice.ocrResult?.totalAmount 
                          ? `$${invoice.ocrResult.totalAmount.toLocaleString()}` 
                          : '-'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="查看詳情">
                          <IconButton size="small" onClick={() => handleViewInvoice(invoice)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {hasRole('accountant') && (
                          <Tooltip title="編輯">
                            <IconButton size="small" onClick={() => handleEditInvoice(invoice)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {invoice.ocrResult && (
                          <Tooltip title="下載">
                            <IconButton size="small">
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {hasRole('accountant') && (
                          <Tooltip title="刪除">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteInvoice(invoice)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* 分頁 */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="每頁行數："
          />
        </CardContent>
      </Card>

      {/* 刪除確認對話框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <Typography>
            確定要刪除發票「{selectedInvoice?.fileName}」嗎？此操作無法撤銷。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            取消
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            刪除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceListPage;