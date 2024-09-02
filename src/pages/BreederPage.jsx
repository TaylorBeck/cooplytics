import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { EggAlt, Pets, LocalShipping, BarChart } from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, display: 'flex', alignItems: 'center' }}
  >
    <Box sx={{ mr: 2, bgcolor: `${color}.light`, p: 1, borderRadius: 1 }}>{icon}</Box>
    <Box>
      <Typography
        variant="h6"
        component="div"
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        component="div"
        fontWeight="bold"
      >
        {value}
      </Typography>
    </Box>
  </Paper>
);

export default function BreederPage() {
  const [breederData, setBreederData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreederData = async () => {
      try {
        const response = {
          totalChickens: 5000,
          eggsProduced: 3500,
          chicksSold: 2000,
          hatchRate: 85
        };

        setBreederData(response);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBreederData();
  }, []);

  const eggProductionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Eggs Produced',
        data: [3000, 3200, 3100, 3400, 3300, 3500],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const breedDistributionData = {
    labels: ['Rhode Island Red', 'Leghorn', 'Plymouth Rock', 'Orpington', 'Other'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }
    ]
  };

  const chicksSoldData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Chicks Sold',
        data: [1800, 1900, 2100, 2000, 2200, 2000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
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

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
        >
          Breeder Farm Statistics
        </Typography>
        <Grid
          container
          spacing={3}
          width="100%"
        >
          <Grid
            item
            sm={12}
            md={6}
            lg={3}
            width="100%"
          >
            <StatCard
              title="Total Chickens"
              value={breederData.totalChickens.toLocaleString()}
              icon={<Pets sx={{ color: 'success.main' }} />}
              color="success"
            />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            lg={3}
            width="100%"
          >
            <StatCard
              title="Eggs Produced"
              value={breederData.eggsProduced.toLocaleString()}
              icon={<EggAlt sx={{ color: 'info.main' }} />}
              color="info"
            />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            lg={3}
            width="100%"
          >
            <StatCard
              title="Chicks Sold"
              value={breederData.chicksSold.toLocaleString()}
              icon={<LocalShipping sx={{ color: 'warning.main' }} />}
              color="warning"
            />
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            lg={3}
            width="100%"
          >
            <StatCard
              title="Hatch Rate"
              value={`${breederData.hatchRate}%`}
              icon={<BarChart sx={{ color: 'error.main' }} />}
              color="error"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Paper
              elevation={3}
              sx={{ p: 2, mb: 3 }}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                Egg Production Trend
              </Typography>
              <Line data={eggProductionData} />
            </Paper>
            <Paper
              elevation={3}
              sx={{ p: 2 }}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                Chicks Sold
              </Typography>
              <Bar data={chicksSoldData} />
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
          >
            <Paper
              elevation={3}
              sx={{ p: 2 }}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                Breed Distribution
              </Typography>
              <Pie data={breedDistributionData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
