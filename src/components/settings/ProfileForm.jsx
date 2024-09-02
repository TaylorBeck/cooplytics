import { TextField, Button, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

export default function ProfileForm() {
  const user = useSelector(state => state.auth.user);

  const handleSubmit = event => {
    event.preventDefault();
    console.log({ name, email });
    // TODO: Implement profile update logic
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
        Profile Information
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="Name"
        name="name"
        autoComplete="name"
        value={user.name}
        onChange={e => setName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={user.email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Update Profile
      </Button>
    </Box>
  );
}
