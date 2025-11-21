import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { settingsApi } from '../../utils/api';

// 會計類別類型
interface AccountingCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CategoriesPage: React.FC = () => {
  // 狀態管理
  const [categories, setCategories] = useState<AccountingCategory[]>([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AccountingCategory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AccountingCategory | null>(null);

  // 表單數據
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    parentId: '',
    isActive: 'true',
    keywords: '',
  });

  // 載入類別列表
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await settingsApi.getCategories();
      
      if (response.success) {
        setCategories(response.data);
      } else {
        // 使用模擬資料
        setCategories(getMockCategories());
      }
    } catch (err) {
      console.error('Load categories error:', err);
      // 使用模擬資料
      setCategories(getMockCategories());
    } finally {
      setLoading(false);
    }
  }, []);

  // 模擬資料
  const getMockCategories = (): AccountingCategory[] => {
    return [
      {
        id: '1',
        code: '5001',
        name: '辦公用品',
        description: '日常辦公所需用品',
        isActive: true,
        keywords: ['紙張', '文具', '印表機', '碳粉'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        code: '5002',
        name: '差旅費',
        description: '員工出差相關費用',
        isActive: true,
        keywords: ['交通', '住宿', '機票', '高鐵', '油費'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '3',
        code: '5003',
        name: '餐飲費',
        description: '員工餐飲和招待費用',
        isActive: true,
        keywords: ['餐廳', '便當', '咖啡', '招待'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '4',
        code: '5004',
        name: '設備費',
        description: '公司設備採購和維護',
        isActive: true,
        keywords: ['電腦', '設備', '維修', '軟體'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '5',
        code: '5005',
        name: '通訊費',
        description: '電話、網路等通訊費用',
        isActive: true,
        keywords: ['電話費', '網路費', '手機'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: '6',
        code: '5006',
        name: '租金',
        description: '辦公室租金和相關費用',
        isActive: false,
        keywords: ['租金', '水電', '管理費'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ];
  };

  // 初始載入
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 重置表單
  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      parentId: '',
      isActive: 'true',
      keywords: '',
    });
  };

  // 開啟新增對話框
  const handleAddCategory = () => {
    setEditingCategory(null);
    resetForm();
    setDialogOpen(true);
  };

  // 開啟編輯對話框
  const handleEditCategory = (category: AccountingCategory) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      name: category.name,
      description: category.description || '',
      parentId: category.parentId || '',
      isActive: category.isActive ? 'true' : 'false',
      keywords: category.keywords.join(', '),
    });
    setDialogOpen(true);
  };

  // 儲存類別
  const handleSaveCategory = async () => {
    try {
      const categoryData = {
        ...formData,
        isActive: formData.isActive === 'true',
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
      };

      let response;
      if (editingCategory) {
        response = await settingsApi.updateCategory(editingCategory.id, categoryData);
      } else {
        response = await settingsApi.createCategory(categoryData);
      }

      if (response.success) {
        setDialogOpen(false);
        loadCategories();
        setError(null);
      } else {
        setError(response.message || '儲存失敗');
      }
    } catch (err) {
      console.error('Save category error:', err);
      setError('儲存類別時發生錯誤');
    }
  };

  // 刪除類別
  const handleDeleteCategory = (category: AccountingCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  // 確認刪除
  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await settingsApi.deleteCategory(selectedCategory.id);
      if (response.success) {
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
        loadCategories();
        setError(null);
      } else {
        setError(response.message || '刪除失敗');
      }
    } catch (err) {
      console.error('Delete category error:', err);
      setError('刪除類別時發生錯誤');
    }
  };

  // 處理表單輸入
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 處理選擇框變更
  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 狀態標籤
  const StatusChip: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <Chip
      label={isActive ? '啟用' : '停用'}
      color={isActive ? 'success' : 'default'}
      size="small"
    />
  );

  return (
    <Box>
      {/* 標題和新增按鈕 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            會計類別管理
          </Typography>
          <Typography variant="body1" color="text.secondary">
            管理發票自動分類的會計科目
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCategory}
          sx={{
            backgroundColor: '#1E3A8A',
            '&:hover': { backgroundColor: '#1E40AF' },
          }}
        >
          新增類別
        </Button>
      </Box>

      {/* 錯誤訊息 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 類別列表 */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>代碼</TableCell>
                  <TableCell>名稱</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>關鍵字</TableCell>
                  <TableCell align="center">狀態</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                        {category.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {category.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {category.keywords.slice(0, 3).map((keyword, index) => (
                          <Chip key={index} label={keyword} size="small" variant="outlined" />
                        ))}
                        {category.keywords.length > 3 && (
                          <Chip
                            label={`+${category.keywords.length - 3}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <StatusChip isActive={category.isActive} />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="編輯">
                          <IconButton size="small" onClick={() => handleEditCategory(category)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="刪除">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 新增/編輯對話框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCategory ? '編輯類別' : '新增類別'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="code"
                label="類別代碼"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="例如：5001"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="name"
                label="類別名稱"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="例如：辦公用品"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="description"
                label="描述"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="類別的詳細描述..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>父類別</InputLabel>
                <Select
                  name="parentId"
                  value={formData.parentId}
                  onChange={handleSelectChange}
                  label="父類別"
                >
                  <MenuItem value="">無</MenuItem>
                  {categories.filter(c => c.id !== editingCategory?.id).map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.code} - {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>狀態</InputLabel>
                <Select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleSelectChange}
                  label="狀態"
                >
                  <MenuItem value="true">啟用</MenuItem>
                  <MenuItem value="false">停用</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                name="keywords"
                label="關鍵字"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="用逗號分隔，例如：紙張, 文具, 印表機, 碳粉"
                helperText="這些關鍵字將用於自動分類發票項目"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            取消
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.code || !formData.name}
          >
            儲存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 刪除確認對話框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>確認刪除</DialogTitle>
        <DialogContent>
          <Typography>
            確定要刪除類別「{selectedCategory?.name}」嗎？此操作無法撤銷。
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

export default CategoriesPage;