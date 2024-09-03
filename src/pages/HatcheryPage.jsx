import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from '../components/layout/MainLayout';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Skeleton
} from '@mui/material';

export default function HatcheryPage() {
  const [hatcheries, setHatcheries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    setTimeout(() => {
      const mockHatcheries = [
        {
          id: 1,
          name: 'Broiler Hatchery',
          capacity: 1000,
          breed: 'Rhode Island Red',
          imageUrl: 'https://s3-poultrypro.s3.us-west-2.amazonaws.com/farm-3.png'
        },
        {
          id: 2,
          name: 'Egg Laying Hatchery',
          capacity: 1500,
          breed: 'Leghorn',
          imageUrl: 'https://s3-poultrypro.s3.us-west-2.amazonaws.com/farm-4.png'
        },
        {
          id: 3,
          name: 'Plymouth Rock Hatchery',
          capacity: 800,
          breed: 'Plymouth Rock',
          imageUrl: 'https://s3-poultrypro.s3.us-west-2.amazonaws.com/farm-2.png'
        }
      ];
      setHatcheries(mockHatcheries);
      setLoading(false);
    }, 1000);
  }, []);

  const renderContent = () => (
    <>
      {loading ? (
        <Skeleton
          variant="text"
          width="200px"
          height={40}
          sx={{ mb: 2 }}
        />
      ) : (
        <Typography
          variant="h4"
          component="h2"
          mb={2}
        >
          Hatcheries
        </Typography>
      )}
      <Grid
        container
        spacing={3}
      >
        {loading ? (
          [1, 2, 3].map(item => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Skeleton
                  variant="rectangular"
                  height={140}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Skeleton
                    variant="text"
                    height={32}
                    width="80%"
                  />
                  <Skeleton
                    variant="text"
                    height={24}
                    width="60%"
                  />
                  <Skeleton
                    variant="text"
                    height={24}
                    width="40%"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : hatcheries.length > 0 ? (
          hatcheries.map(hatchery => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={hatchery.id}
            >
              <Card
                onClick={() => navigate(`/hatcheries/${hatchery.id}`)}
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
                  image={hatchery.imageUrl}
                  alt={hatchery.name || 'Hatchery Image'}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {hatchery.name || 'Unnamed Hatchery'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Capacity: {hatchery.capacity || 'N/A'} eggs
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Breed: {hatchery.breed || 'N/A'}
                  </Typography>
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
              No hatcheries found. Add a hatchery to get started!
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );

  return <MainLayout>{renderContent()}</MainLayout>;
}
