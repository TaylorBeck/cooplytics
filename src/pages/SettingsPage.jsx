import { Container, Typography, Divider, Box } from '@mui/material';

import MainLayout from '../components/layout/MainLayout';
import ProfileForm from '../components/settings/ProfileForm';
import NotificationForm from '../components/settings/NotificationForm';
import SecurityForm from '../components/settings/SecurityForm';

export default function SettingsPage() {
  return (
    <MainLayout>
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
          >
            Admin Settings
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
          >
            Manage your account settings and preferences.
          </Typography>
        </Box>
        <Divider sx={{ my: 4 }} />
        <ProfileForm />
        <Divider sx={{ my: 4 }} />
        <NotificationForm />
        <Divider sx={{ my: 4 }} />
        <SecurityForm />
      </Container>
    </MainLayout>
  );
}
