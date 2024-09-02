import { useState } from 'react';
import { FormControlLabel, Switch, Typography } from '@mui/material';

export default function NotificationForm() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [lockAccount, setLockAccount] = useState(false);

  const handleChange = event => {
    const { name, checked } = event.target;
    if (name === 'twoFactorAuth') {
      setTwoFactorAuth(checked);
    } else if (name === 'lockAccount') {
      setLockAccount(checked);
    }
  };

  return (
    <div sx={{ mt: 1 }}>
      <Typography
        variant="h6"
        gutterBottom
      >
        Security Preferences
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={twoFactorAuth}
            onChange={handleChange}
            name="twoFactorAuth"
          />
        }
        label="Two-Factor Authentication"
      />
      <FormControlLabel
        control={
          <Switch
            checked={lockAccount}
            onChange={handleChange}
            name="lockAccount"
          />
        }
        label="Lock Account"
      />
    </div>
  );
}
