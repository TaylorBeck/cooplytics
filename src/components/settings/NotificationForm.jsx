import { useState } from 'react';
import { FormControlLabel, Switch, Typography } from '@mui/material';

export default function NotificationForm() {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleChange = event => {
    const { name, checked } = event.target;
    if (name === 'emailNotifications') {
      setEmailNotifications(checked);
    } else if (name === 'smsNotifications') {
      setSmsNotifications(checked);
    }
  };

  return (
    <div>
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
            onChange={handleChange}
            name="emailNotifications"
          />
        }
        label="Email Notifications"
      />
      <FormControlLabel
        control={
          <Switch
            checked={smsNotifications}
            onChange={handleChange}
            name="smsNotifications"
          />
        }
        label="SMS Notifications"
      />
    </div>
  );
}
