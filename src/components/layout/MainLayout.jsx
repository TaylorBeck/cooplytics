import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { persistor } from '../../redux/store';
import { auth } from '../../api/firebaseConfig';

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
  Drawer
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PetsIcon from '@mui/icons-material/Pets';
import EggIcon from '@mui/icons-material/Egg';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 200;
const closedDrawerWidth = 59;

const theme = createTheme({
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
  backgroundColor: theme.palette.primary.main, // Add this line
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
  { text: 'Farms', icon: <AgricultureIcon />, path: '/chickens' },
  { text: 'Breeder', icon: <PetsIcon />, path: '/breeder' },
  { text: 'Hatchery', icon: <EggIcon />, path: '/hatchery' },
  { text: 'Feed Mill', icon: <LocalDiningIcon />, path: '/feed-mill' },
  { text: 'Finances', icon: <AttachMoneyIcon />, path: '/finances' },
  { text: 'Calendar', icon: <CalendarIcon />, path: '/calendar' }
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

export default function Dashboard({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
              Dashboard
            </Typography>
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
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 2 }}>
            <IconButton
              onClick={handlePopoverOpen}
              sx={{ marginLeft: '0', padding: '0' }}
            >
              <Avatar
                alt="User Avatar"
                src="/face-1.png"
                sx={{
                  boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)'
                }}
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
        <MainContent open={open}>
          <Toolbar />
          <Container
            maxWidth="lg"
            sx={{ mt: 0, mb: 4, pr: 0, mr: 0 }}
          >
            <Grid container>{children}</Grid>
          </Container>
        </MainContent>
      </Box>
    </ThemeProvider>
  );
}
