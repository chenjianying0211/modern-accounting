import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { Invoice } from '../types/invoice';

const InvoiceListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 模擬資料
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      fileName: 'invoice_001.jpg',
      fileSize: 2048576,
      uploadDate: new Date('2024-11-10'),
      status: 'completed',
      ocrResult: {
        invoiceNumber: 'INV-2024-001',
        date: '2024-11-08',
        seller: {
          name: '科技公司有限公司',
          taxId: '12345678',
          address: '台北市信義區信義路五段7號',
        },
        items: [
          { description: '軟體授權', quantity: 1, unitPrice: 50000, amount: 50000 },
          { description: '技術支援', quantity: 12, unitPrice: 5000, amount: 60000 },
        ],
        totalAmount: 110000,
        taxAmount: 5500,
        confidence: 0.96,
      },
    },
    {
      id: '2',
      fileName: 'receipt_002.pdf',
      fileSize: 1024000,
      uploadDate: new Date('2024-11-09'),
      status: 'completed',
      ocrResult: {
        invoiceNumber: 'INV-2024-002',
        date: '2024-11-09',
        seller: {
          name: '辦公用品商店',
          taxId: '87654321',
          address: '台北市中山區中山北路二段48號',
        },
        items: [
          { description: '影印紙', quantity: 10, unitPrice: 150, amount: 1500 },
          { description: '原子筆', quantity: 50, unitPrice: 15, amount: 750 },
        ],
        totalAmount: 2250,
        taxAmount: 112,
        confidence: 0.92,
      },
    },
    {
      id: '3',
      fileName: 'invoice_003.png',
      fileSize: 3145728,
      uploadDate: new Date('2024-11-09'),
      status: 'processing',
    },
  ];

  const handleViewDetail = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailDialogOpen(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Invoice['status']) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'processing': return '處理中';
      case 'error': return '處理失敗';
      default: return '未知';
    }
  };

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.ocrResult?.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.ocrResult?.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      {/* 頁面標題和搜尋 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          發票管理
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="搜尋發票..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleMenuClick}
            >
              篩選
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>所有狀態</MenuItem>
              <MenuItem onClick={handleMenuClose}>已完成</MenuItem>
              <MenuItem onClick={handleMenuClose}>處理中</MenuItem>
              <MenuItem onClick={handleMenuClose}>處理失敗</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Box>

      {/* 發票列表 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>檔案名稱</TableCell>
              <TableCell>發票號碼</TableCell>
              <TableCell>開立日期</TableCell>
              <TableCell>賣方</TableCell>
              <TableCell align="right">金額</TableCell>
              <TableCell align="center">狀態</TableCell>
              <TableCell align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {invoice.fileName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(invoice.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {invoice.ocrResult?.invoiceNumber || '-'}
                </TableCell>
                <TableCell>
                  {invoice.ocrResult?.date || '-'}
                </TableCell>
                <TableCell>
                  {invoice.ocrResult?.seller.name || '-'}
                </TableCell>
                <TableCell align="right">
                  {invoice.ocrResult 
                    ? `NT$ ${invoice.ocrResult.totalAmount.toLocaleString()}`
                    : '-'
                  }
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={getStatusText(invoice.status)}
                    color={getStatusColor(invoice.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleViewDetail(invoice)}
                    disabled={invoice.status !== 'completed'}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" disabled={invoice.status !== 'completed'}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton size="small">
                    <MoreIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredInvoices.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            沒有找到符合條件的發票
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            請嘗試調整搜尋條件或上傳新的發票
          </Typography>
        </Box>
      )}

      {/* 發票詳情對話框 */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          發票詳細資訊
        </DialogTitle>
        <DialogContent>
          {selectedInvoice?.ocrResult && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  基本資訊
                </Typography>
                <Typography><strong>發票號碼：</strong>{selectedInvoice.ocrResult.invoiceNumber}</Typography>
                <Typography><strong>開立日期：</strong>{selectedInvoice.ocrResult.date}</Typography>
                <Typography><strong>信心度：</strong>{(selectedInvoice.ocrResult.confidence * 100).toFixed(1)}%</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  賣方資訊
                </Typography>
                <Typography><strong>公司名稱：</strong>{selectedInvoice.ocrResult.seller.name}</Typography>
                <Typography><strong>統一編號：</strong>{selectedInvoice.ocrResult.seller.taxId}</Typography>
                <Typography><strong>地址：</strong>{selectedInvoice.ocrResult.seller.address}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  商品明細
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>品名</TableCell>
                        <TableCell align="right">數量</TableCell>
                        <TableCell align="right">單價</TableCell>
                        <TableCell align="right">金額</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedInvoice.ocrResult.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">NT$ {item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell align="right">NT$ {item.amount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>小計</strong></TableCell>
                        <TableCell align="right">
                          <strong>NT$ {selectedInvoice.ocrResult.totalAmount.toLocaleString()}</strong>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={3} align="right"><strong>營業稅</strong></TableCell>
                        <TableCell align="right">
                          <strong>NT$ {selectedInvoice.ocrResult.taxAmount.toLocaleString()}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>
            關閉
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            匯出 Excel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceListPage;