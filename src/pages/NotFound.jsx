import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';

const NotFoundBackground = styled(Box)({
  background: `url('https://s3-taylor-inventorymanagement.s3.us-west-2.amazonaws.com/404-min.jpg') no-repeat center center fixed`,
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px'
});

const TextShadow = styled(Typography)({
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
});

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundBackground>
      <Box
        mb={8}
        textAlign="center"
      >
        <TextShadow
          variant="h3"
          color="white"
          fontWeight="fontWeightBold"
        >
          Uh oh! You may be lost.
        </TextShadow>
      </Box>
      <Box textAlign="center">
        <TextShadow
          variant="h5"
          color="white"
        >
          It looks like the page you're looking for doesn't exist.
        </TextShadow>
      </Box>
      <Box mt={8}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/sign-in')}
          sx={{
            padding: '8px 16px',
            fontSize: '20px',
            backgroundColor: 'white',
            color: 'black',
            textTransform: 'capitalize',
            '&:hover': {
              backgroundColor: 'white',
              boxShadow: '0 0 10px rgba(255,255,255,0.5)'
            }
          }}
        >
          Sign In
        </Button>
      </Box>
    </NotFoundBackground>
  );
};

export default NotFound;
