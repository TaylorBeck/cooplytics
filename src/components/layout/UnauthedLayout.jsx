import {
  Avatar,
  CssBaseline,
  Typography,
  Container,
  Snackbar,
  Alert
} from '@mui/material';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh'
}));

const StyledPaper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: '8px',
  backgroundColor: 'white',
  boxShadow: theme.shadows[2]
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1),
  width: '90px',
  height: '90px'
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2)
}));

export default function UnauthedLayout({
  children,
  title,
  snackbarProps,
  closeSnackbar
}) {
  return (
    <div className="auth-background">
      <StyledContainer
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
            {title}
          </Typography>
          <StyledForm noValidate>{children}</StyledForm>
        </StyledPaper>
      </StyledContainer>
      <Snackbar
        open={snackbarProps.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={Slide}
        key={Slide.name}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbarProps.severity}
          sx={{ width: '100%' }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
