/* eslint-disable quotes */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure
} from '../redux/slices/authSlice';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

import { Button, TextField, Link, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import UnauthedLayout from '../components/layout/UnauthedLayout';

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2)
}));

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [snackbarProps, setSnackbarProps] = useState({ open: false });
  const closeSnackbar = () => {
    setSnackbarProps({
      open: false,
      message: snackbarProps.message,
      severity: snackbarProps.severity
    });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    setIsLoading(true);
    dispatch(loginStart());
    try {
      const { user, idToken } = await loginUser({ email, password });
      dispatch(loginSuccess({ user, idToken }));

      setSnackbarProps({
        message: 'Signed in successfully',
        severity: 'success',
        open: true
      });

      // Navigate to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      dispatch(loginFailure(error.message || 'Failed to sign in'));
      setSnackbarProps({
        message: error.message || 'Failed to sign in',
        severity: 'error',
        open: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UnauthedLayout
      title="Sign in to Poultry Pro"
      snackbarProps={snackbarProps}
      closeSnackbar={closeSnackbar}
    >
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <StyledSubmitButton
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </StyledSubmitButton>
      <Grid container>
        <Grid item>
          <Link
            href="/sign-up"
            variant="body2"
          >
            {`Don't have an account? Sign Up`}
          </Link>
        </Grid>
      </Grid>
    </UnauthedLayout>
  );
}
