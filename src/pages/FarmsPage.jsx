import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { useSelector } from 'react-redux';
import { db } from '../api/firebaseConfig';
import MainLayout from '../components/layout/MainLayout';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress
} from '@mui/material';

export default function FarmsPage() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchUserFarms = async () => {
      if (!user?.uid) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const userFarmsRef = ref(db, `users/${user.uid}/farms`);
        const userFarmsSnapshot = await get(userFarmsRef);

        if (userFarmsSnapshot.exists()) {
          const userFarms = userFarmsSnapshot.val();
          const farmsRef = ref(db, 'farms');

          onValue(
            farmsRef,
            snapshot => {
              const data = snapshot.val();
              if (data) {
                const userFarmsArray = Object.keys(userFarms)
                  .filter(farmId => data[farmId])
                  .map(farmId => ({
                    id: farmId,
                    ...data[farmId]
                  }));
                setFarms(userFarmsArray);
              }
              setLoading(false);
            },
            error => {
              setError(error.message);
              setLoading(false);
            }
          );
        } else {
          setFarms([]);
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUserFarms();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          <Typography
            variant="h6"
            color="error"
          >
            {error}
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography
        variant="h4"
        component="h2"
        mb={2}
      >
        Farms
      </Typography>
      <Grid
        container
        spacing={3}
      >
        {farms.length > 0 ? (
          farms.map(farm => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={farm.id}
            >
              <Card
                onClick={() => navigate(`/farms/${farm.id}`)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    farm.imageUrl || 'https://via.placeholder.com/300x140?text=No+Image'
                  }
                  alt={farm.name || 'Farm Image'}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {farm.name || 'Unnamed Farm'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Address: {farm.location?.address || 'No address'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    City: {farm.location?.city || 'N/A'}
                  </Typography>
                  {/* Add more farm details here as needed */}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid
            item
            xs={12}
          >
            <Typography
              variant="body1"
              align="center"
            >
              No farms found. Add a farm to get started!
            </Typography>
          </Grid>
        )}
      </Grid>
    </MainLayout>
  );
}
