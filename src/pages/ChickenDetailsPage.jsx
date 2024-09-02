import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../api/firebaseConfig';
import MainLayout from '../components/layout/MainLayout';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
// Add these imports
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import ScaleIcon from '@mui/icons-material/Scale';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

export default function ChickenDetailsPage() {
  const { farmId, chickenId } = useParams();
  const [chicken, setChicken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchChicken = async () => {
      if (!user?.uid) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        // First, check if the user has access to this farm
        const userFarmRef = ref(db, `users/${user.uid}/farms/${farmId}`);
        const userFarmSnapshot = await get(userFarmRef);

        if (!userFarmSnapshot.exists() || !userFarmSnapshot.val()) {
          setError('You do not have access to this farm');
          setLoading(false);
          return;
        }

        // If the user has access, fetch the chicken data
        const chickenRef = ref(db, `chickens/${farmId}/${chickenId}`);
        const chickenSnapshot = await get(chickenRef);

        if (chickenSnapshot.exists()) {
          setChicken(chickenSnapshot.val());
        } else {
          setError('Chicken not found');
        }
      } catch (err) {
        console.error('Error fetching chicken:', err);
        setError('Error fetching chicken data');
      } finally {
        setLoading(false);
      }
    };

    fetchChicken();
  }, [farmId, chickenId, user]);

  const getMostRecentMeasurement = measurements => {
    if (!measurements) return null;
    const sortedMeasurements = Object.values(measurements).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sortedMeasurements[0];
  };

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
        <Typography color="error">{error}</Typography>
      </MainLayout>
    );
  }

  if (!chicken) {
    return (
      <MainLayout>
        <Typography>Chicken not found</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography
            variant="h4"
            gutterBottom
          >
            {chicken.name}
          </Typography>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
              md={6}
            >
              <img
                src={chicken.images?.image1?.url}
                alt={chicken.name}
                style={{ width: '375px', height: '375px', borderRadius: '8px' }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                Details
              </Typography>
              <TableContainer
                component={Paper}
                elevation={0}
              >
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        Type
                      </TableCell>
                      <TableCell align="right">{chicken.type}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        Date Hatched
                      </TableCell>
                      <TableCell align="right">{chicken.dateHatched}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        Current Location
                      </TableCell>
                      <TableCell align="right">{chicken.currentLocation}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        Egg Color
                      </TableCell>
                      <TableCell align="right">{chicken.eggColor}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        Popularity
                      </TableCell>
                      <TableCell align="right">{chicken.popularity}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1 }}
              >
                Most Recent Measurement
              </Typography>
              {getMostRecentMeasurement(chicken.measurements) && (
                <TableContainer
                  component={Paper}
                  elevation={0}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                        >
                          Weight
                        </TableCell>
                        <TableCell align="right">
                          {getMostRecentMeasurement(chicken.measurements).weight} kg
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                        >
                          Height
                        </TableCell>
                        <TableCell align="right">
                          {getMostRecentMeasurement(chicken.measurements).height} cm
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                        >
                          Date
                        </TableCell>
                        <TableCell align="right">
                          {getMostRecentMeasurement(chicken.measurements).date}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 2 }}
              >
                Measurement History
              </Typography>
              <Timeline position="alternate">
                {Object.entries(chicken.measurements || {}).map(
                  ([key, measurement], index) => (
                    <TimelineItem key={key}>
                      <TimelineOppositeContent
                        sx={{ m: 'auto 0' }}
                        align={index % 2 === 0 ? 'right' : 'left'}
                        variant="body2"
                        color="text.secondary"
                      >
                        {measurement.date}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="primary">
                          <ScaleIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography
                          variant="h6"
                          component="span"
                        >
                          Measurement
                        </Typography>
                        <Typography>Weight: {measurement.weight} kg</Typography>
                        <Typography>Height: {measurement.height} cm</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  )
                )}
              </Timeline>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </MainLayout>
  );
}
