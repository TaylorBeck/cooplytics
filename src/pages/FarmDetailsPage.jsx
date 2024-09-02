import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../api/firebaseConfig';
import MainLayout from '../components/layout/MainLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FarmDetailsPage() {
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const [chickens, setChickens] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [feedChartData, setFeedChartData] = useState(null);
  const [equipmentChartData, setEquipmentChartData] = useState(null);
  const navigate = useNavigate();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    const farmRef = ref(db, `farms/${farmId}`);
    const chickensRef = ref(db, `chickens/${farmId}`);
    const inventoryRef = ref(db, `inventory/${farmId}`);

    onValue(farmRef, snapshot => {
      setFarm(snapshot.val());
    });

    onValue(chickensRef, snapshot => {
      const data = snapshot.val();
      const chickensArray = data ? Object.keys(data).map(key => data[key]) : [];

      setChickens(chickensArray);
    });

    onValue(inventoryRef, snapshot => {
      const inventoryData = snapshot.val();
      setInventory(inventoryData);

      if (inventoryData) {
        // Prepare feed chart data
        const feedLabels = Object.keys(inventoryData.feed);
        const feedData = feedLabels.map(label => inventoryData.feed[label].quantity);
        setFeedChartData({
          labels: feedLabels,
          datasets: [
            {
              data: feedData,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }
          ]
        });

        // Prepare equipment chart data
        const equipmentLabels = Object.keys(inventoryData.equipment);
        const equipmentData = equipmentLabels.map(
          label => inventoryData.equipment[label].total
        );
        setEquipmentChartData({
          labels: equipmentLabels,
          datasets: [
            {
              data: equipmentData,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }
          ]
        });
      }
    });
  }, [farmId]);

  if (!farm) {
    return <div>Loading...</div>;
  }

  const handleChickenClick = chickenId => {
    navigate(`/farms/${farmId}/chickens/${chickenId}`);
  };

  return (
    <MainLayout>
      <Grid
        container
        spacing={3}
        width="100%"
        mt="1px"
      >
        {/* Farm Details Card */}
        <Grid
          item
          xs={12}
          lg={6}
        >
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="134"
                image={farm.imageUrl}
                alt={farm.name}
              />
            </CardActionArea>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
              >
                {farm.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
              >
                {farm.type} - {farm.size}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                gutterBottom
                marginTop={2}
              >
                {farm.location?.address}, {farm.location?.city}, {farm.location?.state},{' '}
                {farm.location?.country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Charts */}
        <Grid
          item
          xs={12}
          lg={6}
          width="100%"
        >
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  {feedChartData && (
                    <>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                      >
                        Feed
                      </Typography>
                      <div style={{ height: '200px', width: '100%' }}>
                        <Bar
                          data={feedChartData}
                          options={chartOptions}
                          color="yellow"
                        />
                      </div>
                    </>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                >
                  {equipmentChartData && (
                    <>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                      >
                        Equipment
                      </Typography>
                      <div style={{ height: '200px', width: '100%' }}>
                        <Bar
                          data={equipmentChartData}
                          options={chartOptions}
                        />
                      </div>
                    </>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chickens Table */}
      <Box sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
        >
          Chickens
        </Typography>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: '100%' }}
            aria-label="chickens table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                  Date Hatched
                </TableCell>
                <TableCell>Current Location</TableCell>
                <TableCell>Egg Color</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  Weight (kg)
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                  Height (cm)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chickens.map(chicken => (
                <TableRow
                  key={chicken.trackingCode}
                  onClick={() => handleChickenClick('chicken10')}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                >
                  <TableCell>{chicken.name}</TableCell>
                  <TableCell>{chicken.type}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    {chicken.dateHatched}
                  </TableCell>
                  <TableCell>{chicken.currentLocation}</TableCell>
                  <TableCell>{chicken.eggColor}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {chicken.measurements?.weight}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {chicken.measurements?.height}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainLayout>
  );
}
