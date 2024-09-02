import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { AttachMoney, TrendingUp, TrendingDown, BarChart } from '@mui/icons-material';
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

export default function FinancesPage() {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        // Replace this with your actual API call
        // const response = await fetch('/api/finances');
        const response = {
          revenue: 1000,
          expenses: 500,
          profit: 500,
          growthRate: 10
        };

        // if (!response.ok) {
        //   throw new Error('Failed to fetch financial data');
        // }
        // const data = await response.json();
        setFinancialData(response);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [650, 590, 800, 810, 960, 1000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const expensesChartData = {
    labels: ['Salaries', 'Marketing', 'Operations', 'Technology', 'Other'],
    datasets: [
      {
        data: [250, 100, 80, 50, 20],
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

  const profitChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Profit',
        data: [300, 250, 400, 350, 500, 450],
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
          Finances
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
              title="Revenue"
              value={`$${financialData.revenue.toLocaleString()}`}
              icon={<AttachMoney sx={{ color: 'success.main' }} />}
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
              title="Expenses"
              value={`$${financialData.expenses.toLocaleString()}`}
              icon={<TrendingDown sx={{ color: 'error.main' }} />}
              color="error"
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
              title="Profit"
              value={`$${financialData.profit.toLocaleString()}`}
              icon={<TrendingUp sx={{ color: 'info.main' }} />}
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
              title="Growth Rate"
              value={`${financialData.growthRate}%`}
              icon={<BarChart sx={{ color: 'warning.main' }} />}
              color="warning"
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
                Revenue Trend
              </Typography>
              <Line data={revenueChartData} />
            </Paper>
            <Paper
              elevation={3}
              sx={{ p: 2 }}
            >
              <Typography
                variant="h6"
                gutterBottom
              >
                Monthly Profit
              </Typography>
              <Bar data={profitChartData} />
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
                Expense Breakdown
              </Typography>
              <Pie data={expensesChartData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
}
