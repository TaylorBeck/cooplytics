import { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { auth, db } from '../../api/firebaseConfig';
import { loginSuccess } from '../../redux/slices/authSlice';

export default function ProfileForm() {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { displayName: name });

      // Update email if changed
      if (email !== user.email) {
        await auth.currentUser.updateEmail(email);
      }

      // Update Realtime Database
      const userRef = ref(db, `users/${auth.currentUser.uid}`);
      await update(userRef, { name, email });

      // Get the updated ID token
      const idToken = await auth.currentUser.getIdToken(true);

      // Update Redux store
      dispatch(loginSuccess({ user: { ...user, name, email }, idToken }));

      // Show success message
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      // You might want to show an error message here as well
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
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
        value={name}
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
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Update Profile'}
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
