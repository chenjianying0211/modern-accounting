import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  AutoAwesome as AIIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import InvoiceDropZone from '../components/InvoiceUpload/InvoiceDropZone';

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
        <Typography variant="h4" component="h1" gutterBottom>
          發票上傳與辨識
        </Typography>
        <Typography variant="body1" color="text.secondary">
          上傳您的發票圖片或 PDF，我們的 AI 系統將自動提取重要資訊
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 主要上傳區域 */}
        <Grid item xs={12} md={8}>
          <InvoiceDropZone />
        </Grid>

        {/* 側邊欄功能說明 */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                系統特色
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemIcon>
                      {feature.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={feature.title}
                      secondary={feature.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                支援格式
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="JPG, JPEG" secondary="高品質圖片格式" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="PNG" secondary="透明背景支援" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FileUploadIcon color="action" />
                  </ListItemIcon>
                  <ListItemText primary="PDF" secondary="多頁文件支援" />
                </ListItem>
              </List>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                • 單檔大小限制：10MB<br />
                • 同時上傳數量：最多 10 個檔案<br />
                • 建議解析度：300 DPI 以上
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InvoiceUploadPage;