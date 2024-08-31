import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  BarChart
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, display: 'flex', alignItems: 'center' }}
  >
    <Box sx={{ mr: 2, bgcolor: `${color}.light`, p: 1, borderRadius: 1 }}>
      {icon}
    </Box>
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
          Financial Dashboard
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
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
            xs={12}
            sm={6}
            md={3}
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
            xs={12}
            sm={6}
            md={3}
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
            xs={12}
            sm={6}
            md={3}
          >
            <StatCard
              title="Growth Rate"
              value={`${financialData.growthRate}%`}
              icon={<BarChart sx={{ color: 'warning.main' }} />}
              color="warning"
            />
          </Grid>
          {/* Add charts */}
        </Grid>
      </Box>
    </MainLayout>
  );
}
