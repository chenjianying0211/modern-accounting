import React from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { FileUpload as FileUploadIcon, AutoAwesome as AIIcon, Speed as SpeedIcon, Security as SecurityIcon } from '@mui/icons-material';
import InvoiceDropZone from '../../components/InvoiceUpload/InvoiceDropZone';

const InvoiceUploadPage: React.FC = () => {
  const features = [
    {
      icon: <AIIcon color="primary" />,
      title: 'AI 智能辨識',
      description: '使用最先進的 OCR 技術，準確率高達 95%',
    },
    {
      icon: <SpeedIcon color="primary" />,
      title: '極速處理',
      description: '平均處理時間少於 3 秒，大幅提升工作效率',
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: '安全可靠',
      description: '採用加密傳輸，確保您的發票資料安全',
    },
  ];

  return (
    <Box>
      {/* 頁面標題 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          發票上傳與辨識
        </Typography>
        <Typography variant="body1" color="text.secondary">
          上傳您的發票圖片或 PDF，我們的 AI 系統將自動提取重要資訊
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 上傳區域 */}
        <Grid item xs={12} lg={8}>
          <InvoiceDropZone />
        </Grid>

        {/* 功能介紹 */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <FileUploadIcon sx={{ mr: 1, color: 'primary.main' }} />
                系統特色
              </Typography>
              
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>{feature.icon}</ListItemIcon>
                    <ListItemText
                      primary={feature.title}
                      secondary={feature.description}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>支援格式：</strong> JPG, PNG, PDF
                  <br />
                  <strong>最大檔案：</strong> 10MB
                  <br />
                  <strong>同時上傳：</strong> 最多 5 個檔案
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceUploadPage;