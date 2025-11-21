import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  FileUpload as FileUploadIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
  ExpandLess,
  ExpandMore,
  AccountBalance as LogoIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

interface SidebarProps {
  children: React.ReactNode;
}

interface MenuItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItemType[];
  show: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, hasRole } = useAuth();

  const [open, setOpen] = useState(!isMobile);
  const [invoicesExpanded, setInvoicesExpanded] = useState(true);
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // 定義選單項目
  const menuItems: MenuItemType[] = [
    {
      id: 'dashboard',
      label: '儀表板',
      icon: <DashboardIcon />,
      path: '/dashboard',
      show: true,
    },
    {
      id: 'invoices',
      label: '發票管理',
      icon: <ReceiptIcon />,
      show: hasRole('uploader'),
      children: [
        {
          id: 'invoice-list',
          label: '發票列表',
          icon: <ReceiptIcon />,
          path: '/invoices',
          show: hasRole('uploader'),
        },
        {
          id: 'invoice-upload',
          label: '上傳發票',
          icon: <FileUploadIcon />,
          path: '/invoices/upload',
          show: hasRole('uploader'),
        },
      ],
    },
    {
      id: 'reports',
      label: '報告分析',
      icon: <ReportsIcon />,
      path: '/reports',
      show: hasRole('accountant'),
    },
    {
      id: 'settings',
      label: '系統設定',
      icon: <SettingsIcon />,
      show: hasRole('admin'),
      children: [
        {
          id: 'categories',
          label: '會計科目',
          icon: <CategoryIcon />,
          path: '/settings/categories',
          show: hasRole('admin'),
        },
      ],
    },
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileMenuClose();
  };

  const isSelected = (path: string) => location.pathname === path;

  const renderMenuItem = (item: MenuItemType, level = 0) => {
    if (!item.show) return null;

    if (item.children) {
      const isExpanded = item.id === 'invoices' ? invoicesExpanded : settingsExpanded;
      const handleExpand = () => {
        if (item.id === 'invoices') {
          setInvoicesExpanded(!invoicesExpanded);
        } else if (item.id === 'settings') {
          setSettingsExpanded(!settingsExpanded);
        }
      };

      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleExpand}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                pl: level * 2 + 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: open ? 1 : 0 }}
              />
              {open && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
          </ListItem>
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          onClick={() => item.path && handleMenuClick(item.path)}
          selected={item.path ? isSelected(item.path) : false}
          sx={{
            minHeight: 48,
            justifyContent: open ? 'initial' : 'center',
            px: 2.5,
            pl: level * 2 + 2.5,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.light + '20',
              borderRight: `3px solid ${theme.palette.primary.main}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '30',
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : 'auto',
              justifyContent: 'center',
              color: item.path && isSelected(item.path) ? theme.palette.primary.main : 'inherit',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            sx={{ 
              opacity: open ? 1 : 0,
              color: item.path && isSelected(item.path) ? theme.palette.primary.main : 'inherit',
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo 區域 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          ...theme.mixins.toolbar,
          justifyContent: open ? 'flex-start' : 'center',
        }}
      >
        <LogoIcon
          sx={{
            fontSize: 32,
            color: theme.palette.primary.main,
            mr: open ? 2 : 0,
          }}
        />
        {open && (
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            會計系統
          </Typography>
        )}
        {!isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{ ml: 'auto', display: open ? 'block' : 'none' }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      {/* 主選單 */}
      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map(item => renderMenuItem(item))}
      </List>
      
      <Divider />
      
      {/* 用戶資訊區域 */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              borderRadius: 1,
              p: 1,
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                mr: open ? 2 : 0,
                bgcolor: theme.palette.primary.main,
              }}
            >
              <PersonIcon />
            </Avatar>
            {open && (
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" noWrap>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user.role === 'admin' ? '管理員' : 
                   user.role === 'accountant' ? '會計師' : '上傳者'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { md: open ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              mr: 2,
              display: { md: open ? 'none' : 'block' },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            會計管理系統
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="通知">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {user && (
              <Tooltip title="個人選單">
                <IconButton
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.light',
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: open ? drawerWidth : theme.spacing(7) }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: open ? drawerWidth : theme.spacing(7),
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <PersonIcon sx={{ mr: 1 }} />
          個人資料
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          登出
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${open ? drawerWidth : theme.spacing(7)}px)` },
          mt: '64px',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;