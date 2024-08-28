import { useState } from 'react';
import {
  FormControlLabel,
  Switch,
  Button,
  Box,
  Typography,
} from '@mui/material';

export default function NotificationForm() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    console.log({ emailNotifications, smsNotifications });
    // TODO: Implement notification settings update logic
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1 }}
    >
      <Typography
        variant="h6"
        gutterBottom
      >
        Notification Preferences
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={emailNotifications}
            onChange={e => setEmailNotifications(e.target.checked)}
            name="emailNotifications"
          />
        }
        label="Email Notifications"
      />
      <FormControlLabel
        control={
          <Switch
            checked={smsNotifications}
            onChange={e => setSmsNotifications(e.target.checked)}
            name="smsNotifications"
          />
        }
        label="SMS Notifications"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Update Notifications
      </Button>
    </Box>
  );
}
