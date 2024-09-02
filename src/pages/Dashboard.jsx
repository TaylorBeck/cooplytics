import MainLayout from '../components/layout/MainLayout';
import {
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Data for charts
const eggProductionData = [
  { month: 'Jan', eggs: 300 },
  { month: 'Feb', eggs: 400 },
  { month: 'Mar', eggs: 500 },
  { month: 'Apr', eggs: 700 },
  { month: 'May', eggs: 600 },
  { month: 'Jun', eggs: 800 }
];

const weightDistributionData = [
  { weight: '1-2 kg', count: 10 },
  { weight: '2-3 kg', count: 25 },
  { weight: '3-4 kg', count: 15 },
  { weight: '4-5 kg', count: 5 }
];

const feedConsumptionData = [
  { day: 'Mon', amount: 50 },
  { day: 'Tue', amount: 55 },
  { day: 'Wed', amount: 60 },
  { day: 'Thu', amount: 52 },
  { day: 'Fri', amount: 58 },
  { day: 'Sat', amount: 53 },
  { day: 'Sun', amount: 51 }
];

const healthStatusData = [
  { name: 'Healthy', value: 85 },
  { name: 'Sick', value: 10 },
  { name: 'Recovering', value: 5 }
];

const temperatureData = [
  { time: '00:00', temp: 20 },
  { time: '04:00', temp: 18 },
  { time: '08:00', temp: 22 },
  { time: '12:00', temp: 27 },
  { time: '16:00', temp: 25 },
  { time: '20:00', temp: 22 }
];

const waterConsumptionData = [
  { month: 'Jan', liters: 1000 },
  { month: 'Feb', liters: 1200 },
  { month: 'Mar', liters: 1100 },
  { month: 'Apr', liters: 1300 },
  { month: 'May', liters: 1500 },
  { month: 'Jun', liters: 1400 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const isSmallScreen = useMediaQuery('(max-width:899px)');

  // Chart configurations
  const lineChartOptions = {
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

  const barChartOptions = {
    ...lineChartOptions,
    indexAxis: 'x'
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right'
      }
    }
  };

  return (
    <MainLayout>
      <Container
        maxWidth="lg"
        sx={{ mt: 4, mb: 4 }}
      >
        <Grid
          container
          spacing={3}
        >
          {/* Egg Production */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                paddingBottom: 6
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Egg Production
              </Typography>
              <Line
                options={lineChartOptions}
                data={{
                  labels: eggProductionData.map(d => d.month),
                  datasets: [
                    {
                      data: eggProductionData.map(d => d.eggs),
                      borderColor: '#8884d8',
                      backgroundColor: 'rgba(136, 132, 216, 0.5)'
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>

          {/* Weight Distribution */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                paddingBottom: 6
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Weight Distribution
              </Typography>
              <Bar
                options={barChartOptions}
                data={{
                  labels: weightDistributionData.map(d => d.weight),
                  datasets: [
                    {
                      data: weightDistributionData.map(d => d.count),
                      backgroundColor: COLORS
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>

          {/* Feed Consumption */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                paddingBottom: 6
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Feed Consumption
              </Typography>
              <Bar
                options={barChartOptions}
                data={{
                  labels: feedConsumptionData.map(d => d.day),
                  datasets: [
                    {
                      data: feedConsumptionData.map(d => d.amount),
                      backgroundColor: '#ffc658'
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>

          {/* Health Status */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                paddingBottom: 6
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Health Status
              </Typography>
              <Pie
                options={pieChartOptions}
                data={{
                  labels: healthStatusData.map(d => d.name),
                  datasets: [
                    {
                      data: healthStatusData.map(d => d.value),
                      backgroundColor: COLORS
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>

          {/* Temperature */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                paddingBottom: 6
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Temperature
              </Typography>
              <Line
                options={lineChartOptions}
                data={{
                  labels: temperatureData.map(d => d.time),
                  datasets: [
                    {
                      data: temperatureData.map(d => d.temp),
                      borderColor: '#ff7300',
                      backgroundColor: 'rgba(255, 115, 0, 0.5)'
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>

          {/* Water Consumption */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
          >
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                paddingBottom: 6
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Water Consumption
              </Typography>
              <Bar
                options={barChartOptions}
                data={{
                  labels: waterConsumptionData.map(d => d.month),
                  datasets: [
                    {
                      data: waterConsumptionData.map(d => d.liters),
                      backgroundColor: '#3b82f6'
                    }
                  ]
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}
