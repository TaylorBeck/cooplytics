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
  marginTop: theme.spacing(2)
}));

export default function UnauthedLayout({
  children,
  title,
  snackbarProps,
  closeSnackbar
}) {
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
            {title}
          </Typography>
          <StyledForm noValidate>{children}</StyledForm>
        </StyledPaper>
      </Container>
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
    </>
  );
}
