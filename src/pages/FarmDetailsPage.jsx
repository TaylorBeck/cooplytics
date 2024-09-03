import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../api/firebaseConfig';
import MainLayout from '../components/layout/MainLayout';
import { useSelector } from 'react-redux';
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
  Button,
  TableSortLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useChickens } from '../hooks/useChickens';
import ChickenModal from '../components/ChickenModal';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FarmDetailsPage() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { addChicken, updateChicken } = useChickens();

  const [farm, setFarm] = useState(null);
  const [chickens, setChickens] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [feedChartData, setFeedChartData] = useState(null);
  const [equipmentChartData, setEquipmentChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChicken, setEditingChicken] = useState(null);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const isGuest = useSelector(state => state.auth.isGuest);
  const guestFarmId = useSelector(state => state.auth.guestFarmId);

  // Chart options for consistent styling across charts
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
    // Set up real-time listeners for farm, chickens, and inventory data
    const farmRef = ref(db, `farms/${farmId}`);
    const chickensRef = ref(db, `chickens/${farmId}`);
    const inventoryRef = ref(db, `inventory/${farmId}`);

    onValue(farmRef, snapshot => {
      setFarm(snapshot.val());
    });

    onValue(chickensRef, snapshot => {
      const data = snapshot.val();
      const chickensArray = data
        ? Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }))
        : [];
      console.log('chickensArray', chickensArray);

      setChickens(chickensArray);
    });

    // Prepare chart data when inventory changes
    onValue(inventoryRef, snapshot => {
      const inventoryData = snapshot.val();
      setInventory(inventoryData);

      if (inventoryData) {
        // Transform inventory data into chart-friendly format
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

  const handleChickenClick = useCallback(
    chickenId => {
      if (isGuest && guestFarmId !== farmId) {
        // Guest doesn't have access to this farm
        console.error('Guest does not have access to this farm');
        return;
      }
      navigate(`/farms/${farmId}/chickens/${chickenId}`);
    },
    [farmId, navigate, isGuest, guestFarmId]
  );

  const handleAddChicken = useCallback(() => {
    setEditingChicken(null);
    setIsModalOpen(true);
  }, []);

  const handleEditChicken = useCallback(chicken => {
    setEditingChicken(chicken);
    setIsModalOpen(true);
  }, []);

  const handleSaveChicken = useCallback(
    async chickenData => {
      try {
        if (editingChicken) {
          await updateChicken(farmId, editingChicken.id, chickenData);
        } else {
          await addChicken(farmId, chickenData);
        }
        setIsModalOpen(false);
        // Refresh chickens data if needed
      } catch (error) {
        console.error('Error saving chicken:', error);
        // Handle error (e.g., show an error message)
      }
    },
    [farmId, editingChicken, updateChicken, addChicken]
  );

  const handleRequestSort = useCallback(
    property => {
      setOrder(prevOrder =>
        orderBy === property && prevOrder === 'asc' ? 'desc' : 'asc'
      );
      setOrderBy(property);
    },
    [orderBy]
  );

  // Sort chickens based on current sort criteria
  const sortedChickens = useMemo(() => {
    return [...chickens].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [chickens, order, orderBy]);

  if (!farm) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      {/* Farm Details and Inventory Charts */}
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography
            variant="h5"
            component="h2"
          >
            Chickens
          </Typography>
          {!isGuest && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddChicken}
            >
              Add Chicken
            </Button>
          )}
        </Box>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: '100%' }}
            aria-label="chickens table"
          >
            <TableHead>
              <TableRow>
                {[
                  { id: 'name', label: 'Name' },
                  { id: 'type', label: 'Type' },
                  {
                    id: 'dateHatched',
                    label: 'Date Hatched',
                    hide: { xs: true, md: false }
                  },
                  { id: 'currentLocation', label: 'Current Location' },
                  { id: 'eggColor', label: 'Egg Color' },
                  {
                    id: 'currentWeight',
                    label: 'Weight (kg)',
                    hide: { xs: true, lg: false }
                  },
                  {
                    id: 'currentHeight',
                    label: 'Height (cm)',
                    hide: { xs: true, lg: false }
                  },
                  { id: 'popularity', label: 'Popularity' }
                ].map(headCell => (
                  <TableCell
                    key={headCell.id}
                    sx={
                      headCell.hide
                        ? { display: { ...headCell.hide, table: 'table-cell' } }
                        : {}
                    }
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedChickens.map(chicken => (
                <TableRow
                  key={chicken.id}
                  onClick={() => handleChickenClick(chicken.id)}
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
                    {chicken.currentWeight}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    {chicken.currentHeight}
                  </TableCell>
                  <TableCell>{chicken.popularity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal for adding/editing chickens */}
      {!isGuest && (
        <ChickenModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveChicken}
          chicken={editingChicken}
        />
      )}
    </MainLayout>
  );
}
