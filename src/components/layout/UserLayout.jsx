import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Navbar from '../common/Navbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Home, People, ShowChart, Settings, Egg } from '@mui/icons-material';
import { Typography } from '@mui/material';

import ChickensPage from '../../containers/ChickensPage';
import AnalyticsPage from '../../containers/AnalyticsPage';
import SettingsPage from '../../containers/SettingsPage';
import Dashboard from '../../containers/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light'
  }
});

function UserLayout() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Drawer
            variant="permanent"
            sx={{
              width: 200,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 200,
                boxSizing: 'border-box'
              }
            }}
          >
            <Box sx={{ overflow: 'auto' }}>
              <div className=" justify-center">
                <Egg
                  sx={{
                    fontSize: '40px',
                    marginRight: '10px',
                    color: 'primary'
                  }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    display: { xs: 'none', sm: 'block' },
                    marginTop: ''
                  }}
                >
                  PoultryPro
                </Typography>
              </div>
              <List>
                {[
                  { text: 'Dashboard', icon: <Home />, path: '/' },
                  { text: 'Chickens', icon: <People />, path: '/chickens' },
                  {
                    text: 'Analytics',
                    icon: <ShowChart />,
                    path: '/analytics'
                  },
                  {
                    text: 'Settings',
                    icon: <Settings />,
                    path: '/settings'
                  }
                ].map(item => (
                  <ListItem
                    button
                    key={item.text}
                    component={Link}
                    to={item.path}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
          <Box
            component="main"
            sx={{ flexGrow: 1 }}
          >
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={<Dashboard />}
              />
              <Route
                path="/chickens"
                element={<ChickensPage />}
              />
              <Route
                path="/analytics"
                element={<AnalyticsPage />}
              />
              <Route
                path="/settings"
                element={<SettingsPage />}
              />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default UserLayout;
