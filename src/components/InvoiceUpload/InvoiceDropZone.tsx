import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { UploadStatus } from '../../types/invoice';

const InvoiceDropZone: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 模擬檔案上傳和 OCR 處理
  const simulateOCRProcessing = async (file: File): Promise<void> => {
    const fileId = Math.random().toString(36).substr(2, 9);
    
    // 初始化上傳狀態
    const newUpload: UploadStatus = {
      file,
      progress: 0,
      status: 'uploading',
    };

    setUploadedFiles(prev => [...prev, newUpload]);

    // 模擬上傳進度
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadedFiles(prev => 
        prev.map(upload => 
          upload.file === file 
            ? { ...upload, progress, status: progress === 100 ? 'processing' : 'uploading' }
            : upload
        )
      );
    }

    // 模擬 OCR 處理
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 模擬成功結果
    const mockOCRResult = {
      invoiceNumber: `INV-${fileId}`,
      date: new Date().toISOString().split('T')[0],
      seller: {
        name: '範例公司有限公司',
        taxId: '12345678',
        address: '台北市信義區信義路五段7號',
      },
      items: [
        {
          description: '商品A',
          quantity: 2,
          unitPrice: 1000,
          amount: 2000,
        },
        {
          description: '商品B',
          quantity: 1,
          unitPrice: 500,
          amount: 500,
        },
      ],
      totalAmount: 2500,
      taxAmount: 125,
      confidence: 0.95,
    };

    setUploadedFiles(prev => 
      prev.map(upload => 
        upload.file === file 
          ? { 
              ...upload, 
              status: 'completed',
              result: mockOCRResult 
            }
          : upload
      )
    );
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    for (const file of acceptedFiles) {
      try {
        await simulateOCRProcessing(file);
      } catch (error) {
        setUploadedFiles(prev => 
          prev.map(upload => 
            upload.file === file 
              ? { 
                  ...upload, 
                  status: 'error',
                  error: '處理檔案時發生錯誤'
                }
              : upload
          )
        );
      }
    }

    setIsUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(prev => prev.filter(upload => upload.file !== fileToRemove));
  };

  const getStatusColor = (status: UploadStatus['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'error': return 'error';
      case 'processing': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: UploadStatus['status']) => {
    switch (status) {
      case 'completed': return <CheckIcon color="success" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <FileIcon />;
    }
  };

  return (
    <Box>
      {/* 拖放上傳區域 */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s ease',
          textAlign: 'center',
          mb: 3,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon 
          sx={{ 
            fontSize: 64, 
            color: isDragActive ? 'primary.main' : 'grey.400',
            mb: 2 
          }} 
        />
        <Typography variant="h5" gutterBottom>
          {isDragActive ? '放開檔案以開始上傳' : '拖放發票檔案至此處'}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          或點擊選擇檔案
        </Typography>
        <Typography variant="body2" color="text.secondary">
          支援 JPG、PNG、PDF 格式，單檔最大 10MB
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          disabled={isUploading}
        >
          選擇檔案
        </Button>
      </Paper>

      {/* 檔案列表 */}
      {uploadedFiles.length > 0 && (
        <Typography variant="h6" gutterBottom>
          已上傳檔案 ({uploadedFiles.length})
        </Typography>
      )}

      <Grid container spacing={2}>
        {uploadedFiles.map((upload, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    {getStatusIcon(upload.status)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {upload.file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(upload.file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                  <Chip 
                    label={
                      upload.status === 'uploading' ? '上傳中' :
                      upload.status === 'processing' ? '辨識中' :
                      upload.status === 'completed' ? '完成' :
                      upload.status === 'error' ? '錯誤' : '等待中'
                    }
                    color={getStatusColor(upload.status)}
                    size="small"
                  />
                </Box>

                {upload.status === 'uploading' && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={upload.progress} 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {upload.progress}%
                    </Typography>
                  </Box>
                )}

                {upload.status === 'processing' && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      正在進行 OCR 辨識...
                    </Typography>
                  </Box>
                )}

                {upload.status === 'error' && upload.error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {upload.error}
                  </Alert>
                )}

                {upload.status === 'completed' && upload.result && (
                  <Box sx={{ mb: 2 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                      OCR 辨識完成！信心度: {(upload.result.confidence * 100).toFixed(1)}%
                    </Alert>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="發票號碼" 
                          secondary={upload.result.invoiceNumber} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="開立日期" 
                          secondary={upload.result.date} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="賣方" 
                          secondary={upload.result.seller.name} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="總金額" 
                          secondary={`NT$ ${upload.result.totalAmount.toLocaleString()}`} 
                        />
                      </ListItem>
                    </List>
                  </Box>
                )}
              </CardContent>
              
              <CardActions>
                {upload.status === 'completed' && (
                  <Button 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      // TODO: 實現查看詳細資訊功能
                    }}
                  >
                    查看詳情
                  </Button>
                )}
                <Button 
                  size="small" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeFile(upload.file)}
                >
                  移除
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InvoiceDropZone;