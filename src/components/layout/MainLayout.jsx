import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { persistor } from '../../redux/store';
import { auth } from '../../api/firebaseConfig';
import { Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import {
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Avatar,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  ListItemAvatar
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PetsIcon from '@mui/icons-material/Pets';
import EggIcon from '@mui/icons-material/Egg';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const drawerWidth = 200;
const closedDrawerWidth = 59;

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif'
    ].join(',')
  },
  palette: {
    primary: {
      main: '#003049' // prussian_blue
    },
    secondary: {
      main: '#c1121f' // fire_brick
    },
    background: {
      default: '#FAF9F6' //off_white
    }
  }
});

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: `calc(100% - ${closedDrawerWidth + 12}px)`,
  marginLeft: closedDrawerWidth,
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: '71px',
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Farms', icon: <AgricultureIcon />, path: '/farms' },
  { text: 'Chickens', icon: <WarehouseIcon />, path: '/chickens' },
  { text: 'Breeder', icon: <PetsIcon />, path: '/breeder' },
  { text: 'Hatchery', icon: <EggIcon />, path: '/hatchery' },
  { text: 'Feed Mill', icon: <LocalDiningIcon />, path: '/feed-mill' },
  { text: 'Finances', icon: <AttachMoneyIcon />, path: '/finances' },
  { text: 'Orders', icon: <ShoppingCartIcon />, path: '/orders' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
];

const Logo = styled('img')({
  height: 40,
  marginRight: 16
});

const MainContent = styled(Box, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: closedDrawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  })
}));

export default function Dashboard({ children, title }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();

  const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    '/farms': 'Farms',
    '/chickens': 'Chickens',
    '/breeder': 'Breeder',
    '/hatchery': 'Hatchery',
    '/feed-mill': 'Feed Mill',
    '/finances': 'Finances',
    '/orders': 'Orders',
    '/settings': 'Settings'
  };

  const pathnames = location.pathname.split('/').filter(x => x);

  useEffect(() => {
    if (isSmallScreen) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isSmallScreen]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  const handleLogout = async () => {
    await auth.signOut(); // Sign out from Firebase
    dispatch(logout()); // Dispatch the logout action
    persistor.purge(); // Clear persisted store data
    navigate('/sign-in'); // Navigate to sign-in page
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const notifications = [
    {
      id: 1,
      type: 'warning',
      message: 'Low feed stock in Coop #3',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'Egg collection due for Coop #1',
      time: '3 hours ago'
    },
    {
      id: 3,
      type: 'success',
      message: 'Vaccinations completed',
      time: '1 day ago'
    },
    {
      id: 4,
      type: 'warning',
      message: 'Unusual temperatures - Coop 1',
      time: '2 days ago'
    },
    {
      id: 5,
      type: 'info',
      message: 'Order #124983 received',
      time: '3 days ago'
    },
    {
      id: 6,
      type: 'danger',
      message: 'Disease outbreak in Coop #2',
      time: '3 days ago'
    }
  ];

  const getNotificationIcon = type => {
    switch (type) {
      case 'warning':
        return <WarningIcon sx={{ color: 'orange' }} />;
      case 'info':
        return <InfoIcon sx={{ color: 'blue' }} />;
      case 'success':
        return <CheckCircleIcon sx={{ color: 'green' }} />;
      case 'danger':
        return <ErrorIcon sx={{ color: 'red' }} />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <StyledAppBar
          position="fixed"
          open={open}
        >
          <Toolbar
            sx={{
              pr: '24px'
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px'
              }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <IconButton
              color="inherit"
              onClick={toggleNotifications}
            >
              <Badge
                badgeContent={4}
                color="secondary"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer
          variant="permanent"
          open={open}
        >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              px: [1]
            }}
          >
            <Logo
              src="/logo-192.png"
              alt="PoultryPro Logo"
              sx={{
                marginRight: open ? '16px' : 'auto',
                marginLeft: open ? '10px' : 'auto'
              }}
            />
            {open && (
              <Typography
                variant="h6"
                noWrap
                component="div"
                fontWeight="bold"
              >
                PoultryPro
              </Typography>
            )}
          </Toolbar>
          <Divider />
          <List component="nav">
            {menuItems.map(item => (
              <ListItem
                button={'true'}
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'rgba(0, 0, 0, 0.75)',
                    minWidth: 0,
                    ml: open ? 0 : '3px',
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontSize: '17px' }}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItem>
            ))}
          </List>
          <Box
            sx={{
              bottom: 0,
              width: '100%',
              p: 2,
              display: 'flex',
              height: '100%',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
          >
            <IconButton
              onClick={handlePopoverOpen}
              sx={{
                marginLeft: '0',
                padding: '0'
              }}
            >
              <Avatar
                alt="User Avatar"
                src={
                  user?.image ||
                  'https://s3-poultrypro.s3.us-west-2.amazonaws.com/face-1.png'
                }
              />
            </IconButton>
            <Popover
              open={popoverOpen}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
            >
              <List>
                <ListItem
                  button={'true'}
                  onClick={() => navigate('/settings')}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
                <ListItem
                  button={'true'}
                  onClick={handleLogout}
                  sx={{
                    '&:hover': {
                      cursor: 'pointer'
                    }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Popover>
          </Box>
        </StyledDrawer>
        <Drawer
          anchor="right"
          open={notificationsOpen}
          onClose={toggleNotifications}
          sx={{
            '& .MuiDrawer-paper': {
              width: 350,
              boxSizing: 'border-box'
            }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
            >
              Notifications
            </Typography>
            <List>
              {notifications.map(notification => (
                <div key={notification.id}>
                  <ListItem
                    sx={{
                      height: '90px'
                    }}
                    key={notification.id}
                    alignItems="center"
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: 'transparent' }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={notification.time}
                    />
                  </ListItem>
                  <Divider />
                </div>
              ))}
            </List>
          </Box>
        </Drawer>
        <MainContent open={open}>
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{ mt: 0, ml: 0, mb: 4, pr: 0, mr: 0 }}
          >
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{ mb: 2 }}
            >
              <Link
                component={RouterLink}
                color="inherit"
                to="/dashboard"
              >
                Home
              </Link>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                return last ? (
                  <Typography
                    color="text.primary"
                    key={to}
                  >
                    {breadcrumbNameMap[to] || value}
                  </Typography>
                ) : (
                  <Link
                    component={RouterLink}
                    color="inherit"
                    to={to}
                    key={to}
                  >
                    {breadcrumbNameMap[to] || value}
                  </Link>
                );
              })}
            </Breadcrumbs>
            <Grid container>{children}</Grid>
          </Container>
        </MainContent>
      </Box>
    </ThemeProvider>
  );
}
