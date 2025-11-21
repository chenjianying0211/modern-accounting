import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { invoiceApi } from '../../utils/api';
import { Invoice } from '../../types/invoice';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入發票詳情
  useEffect(() => {
    const loadInvoiceDetail = async () => {
      if (!id) {
        setError('發票 ID 無效');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await invoiceApi.getInvoiceDetail(id);
        
        if (response.success) {
          setInvoice(response.data);
        } else {
          // 使用模擬資料
          setInvoice(getMockInvoice(id));
        }
      } catch (err) {
        console.error('Load invoice detail error:', err);
        // 使用模擬資料
        setInvoice(getMockInvoice(id));
      } finally {
        setLoading(false);
      }
    };

    loadInvoiceDetail();
  }, [id]);

  // 模擬資料
  const getMockInvoice = (invoiceId: string): Invoice => {
    return {
      id: invoiceId,
      fileName: 'invoice_2024001.pdf',
      fileSize: 1024000,
      uploadDate: new Date('2024-11-10'),
      status: 'completed',
      previewUrl: '/mock-preview.jpg',
      ocrResult: {
        invoiceNumber: 'INV-2024-001',
        date: '2024-11-10',
        seller: {
          name: '台灣科技股份有限公司',
          taxId: '12345678',
          address: '台北市信義區信義路五段7號',
        },
        buyer: {
          name: '採購企業有限公司',
          taxId: '87654321',
          address: '台北市大安區敦化南路二段265號',
        },
        items: [
          { description: '辦公用品 - A4 影印紙', quantity: 5, unitPrice: 200, amount: 1000 },
          { description: '文具用品 - 原子筆', quantity: 3, unitPrice: 150, amount: 450 },
          { description: '電腦耗材 - 碳粉匣', quantity: 1, unitPrice: 2500, amount: 2500 },
        ],
        totalAmount: 3950,
        taxAmount: 197.5,
        confidence: 0.95,
      },
    };
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
    return <Chip label={config.label} color={config.color} />;
  };

  // 格式化檔案大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !invoice) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/invoices')}
          sx={{ mb: 2 }}
        >
          返回發票列表
        </Button>
        <Alert severity="error">
          {error || '發票不存在'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* 標題和操作按鈕 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => navigate('/invoices')} 
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              發票詳情
            </Typography>
            <Typography variant="body2" color="text.secondary">
              檔案名稱：{invoice.fileName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {hasRole('accountant') && (
            <Tooltip title="編輯發票">
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
              >
                編輯
              </Button>
            </Tooltip>
          )}
          <Tooltip title="下載發票">
            <Button variant="outlined" startIcon={<DownloadIcon />}>
              下載
            </Button>
          </Tooltip>
          <Tooltip title="列印發票">
            <Button variant="outlined" startIcon={<PrintIcon />}>
              列印
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* 基本資訊 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                基本資訊
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    檔案名稱
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {invoice.fileName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    檔案大小
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatFileSize(invoice.fileSize)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    上傳日期
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {invoice.uploadDate.toLocaleDateString()} {invoice.uploadDate.toLocaleTimeString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    處理狀態
                  </Typography>
                  <StatusChip status={invoice.status} />
                </Box>

                {invoice.ocrResult && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      辨識信心度
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {(invoice.ocrResult.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>

          {/* 預覽圖 */}
          {invoice.previewUrl && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  發票預覽
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 300,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px dashed',
                    borderColor: 'grey.300',
                  }}
                >
                  <ViewIcon sx={{ fontSize: 48, color: 'grey.400' }} />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* OCR 結果 */}
        <Grid item xs={12} md={8}>
          {invoice.ocrResult ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* 發票基本資訊 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    發票資訊
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        發票號碼
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {invoice.ocrResult.invoiceNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        發票日期
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {invoice.ocrResult.date}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* 賣方資訊 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    賣方資訊
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        公司名稱
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {invoice.ocrResult.seller.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        統一編號
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {invoice.ocrResult.seller.taxId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        地址
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {invoice.ocrResult.seller.address}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* 買方資訊（如果有） */}
              {invoice.ocrResult.buyer && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      買方資訊
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          公司名稱
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {invoice.ocrResult.buyer.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          統一編號
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {invoice.ocrResult.buyer.taxId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          地址
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {invoice.ocrResult.buyer.address}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              )}

              {/* 項目明細 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    項目明細
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>項目描述</TableCell>
                          <TableCell align="center">數量</TableCell>
                          <TableCell align="right">單價</TableCell>
                          <TableCell align="right">金額</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {invoice.ocrResult.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="right">
                              ${item.unitPrice.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              ${item.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Divider sx={{ my: 2 }} />

                  {/* 總計 */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} sx={{ ml: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">
                          小計：
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          ${(invoice.ocrResult.totalAmount - invoice.ocrResult.taxAmount).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">
                          稅額：
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          ${invoice.ocrResult.taxAmount.toLocaleString()}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          總計：
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          ${invoice.ocrResult.totalAmount.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <Card>
              <CardContent>
                <Alert severity="info">
                  OCR 辨識尚未完成或辨識失敗
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceDetailPage;