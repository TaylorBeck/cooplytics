import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  FormControlLabel,
  Link,
  Grid,
  FormControl,
  RadioGroup,
  Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createUser } from '../api/auth';
import UnauthedLayout from '../components/layout/UnauthedLayout';

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2)
}));

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
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
    try {
      await createUser({
        name: `${firstName} ${lastName}`,
        email,
        password,
        role: userType
      });

      setSnackbarProps({
        message: 'User created successfully',
        severity: 'success',
        open: true
      });

      // Navigate to sign-in page after 1.5 seconds
      setTimeout(() => {
        navigate('/sign-in');
      }, 1500);
    } catch (error) {
      setSnackbarProps({
        message: error.message || 'Failed to create user',
        severity: 'error',
        open: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (_, newUserType) => {
    setUserType(newUserType);
  };

  return (
    <UnauthedLayout
      title="Get started with Poultry Pro"
      snackbarProps={snackbarProps}
      closeSnackbar={closeSnackbar}
    >
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
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
    </UnauthedLayout>
  );
}
