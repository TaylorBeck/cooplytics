'use client';

import { useState } from 'react';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Link,
  Grid,
  Typography,
  Container,
  FormControl,
  RadioGroup,
  Radio,
  Snackbar,
  Slide
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { useCreateUser } from '../api/auth';

const StyledPaper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  width: '90px',
  height: '90px'
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3)
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2)
}));

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [snackbarProps, setSnackbarProps] = useState({
    message: '',
    open: false
  });

  const {
    mutate: createUser,
    isLoading,
    isError,
    error,
    isSuccess
  } = useCreateUser();

  const handleSubmit = () => {
    createUser({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: userType
    });

    if (isSuccess) {
      setSnackbarProps({
        message: 'User created successfully',
        open: true
      });
    }

    if (isError) {
      setSnackbarProps({
        message: error.message,
        open: true
      });
    }
  };

  const handleChange = (_, newUserType) => {
    setUserType(newUserType);
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        <StyledPaper>
          <StyledAvatar
            src="/logo-192.png"
            alt="Poultry Pro"
          />
          <Typography
            component="h1"
            variant="h5"
          >
            Get started with Poultry Pro
          </Typography>
          <StyledForm noValidate>
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
              >
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid
                item
                xs={12}
              >
                <TextField
                  variant="outlined"
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
              </Grid>
              <Grid
                item
                xs={12}
              >
                <FormControl>
                  <RadioGroup
                    row
                    name="user-type-group"
                    value={userType}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label="I'm a producer"
                    />
                    <FormControlLabel
                      value="customer"
                      control={<Radio />}
                      label="I'm a buyer"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            <StyledSubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Loading...' : 'Get Started'}
            </StyledSubmitButton>
            <Grid
              container
              justify="flex-end"
            >
              <Grid item>
                <Link
                  href="/"
                  variant="body2"
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </StyledForm>
        </StyledPaper>
      </Container>
      <Snackbar
        {...snackbarProps}
        autoHideDuration={6000}
        onClose={() => setIsSnackbarOpen(false)}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </>
  );
}
