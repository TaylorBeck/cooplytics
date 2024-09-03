import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ref, query, orderByKey, get, onValue, push, set } from 'firebase/database';
import { db } from '../api/firebaseConfig';
import MainLayout from '../components/layout/MainLayout';
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
  Pagination,
  IconButton,
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Snackbar,
  Alert,
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useChickens } from '../hooks/useChickens';
import { useNavigate, useParams } from 'react-router-dom';
import { addChicken, updateChicken } from '../api/chickenApi';

const ITEMS_PER_PAGE = 10;

export default function Chickens() {
  const user = useSelector(state => state.auth.user);
  const { guestToken } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChicken, setNewChicken] = useState({
    identifier: '',
    currentWeight: '',
    currentHeight: '',
    name: '',
    type: '',
    location: '',
    eggColor: '',
    dateHatched: ''
  });
  const [allChickens, setAllChickens] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [editingChicken, setEditingChicken] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  const { addChicken, updateChicken, deleteChicken } = useChickens();

  const fetchChickens = async () => {
    if (!user?.uid && !guestToken) {
      setError('User not authenticated and no guest token provided');
      setLoading(false);
      return;
    }

    try {
      let chickensData = {};

      if (user?.uid) {
        // Fetch chickens for authenticated user
        // This involves querying user's farms and then fetching chickens for each farm
        const userFarmsRef = ref(db, `users/${user.uid}/farms`);
        const userFarmsSnapshot = await get(userFarmsRef);

        if (userFarmsSnapshot.exists()) {
          const userFarms = userFarmsSnapshot.val();
          for (const farmId of Object.keys(userFarms)) {
            const farmChickensRef = ref(db, `chickens/${farmId}`);
            const farmChickensSnapshot = await get(farmChickensRef);

            if (farmChickensSnapshot.exists()) {
              chickensData[farmId] = farmChickensSnapshot.val();
            }
          }
        }
      } else if (guestToken) {
        // Fetch chickens for guest user
        // This involves finding the farm associated with the guest token and fetching its chickens
        const farmsRef = ref(db, 'farms');
        const farmsSnapshot = await get(farmsRef);

        if (farmsSnapshot.exists()) {
          const farms = farmsSnapshot.val();
          for (const [farmId, farmData] of Object.entries(farms)) {
            if (farmData.guestAccess && farmData.guestAccess[guestToken]) {
              const farmChickensRef = ref(db, `chickens/${farmId}`);
              const farmChickensSnapshot = await get(farmChickensRef);

              if (farmChickensSnapshot.exists()) {
                chickensData[farmId] = farmChickensSnapshot.val();
              }
              break; // Only fetch for the first matching farm
            }
          }
        }
      }

      setAllChickens(chickensData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chickens:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChickens();
  }, [user, guestToken]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddChicken = async () => {
    setIsModalOpen(false);
    setNewChicken({
      identifier: '',
      currentWeight: '',
      currentHeight: '',
      name: '',
      type: '',
      location: '',
      eggColor: '',
      dateHatched: ''
    });
  };

  const handleInputChange = e => {
    if (editingChicken) {
      setEditingChicken({ ...editingChicken, [e.target.name]: e.target.value });
    } else {
      setNewChicken({ ...newChicken, [e.target.name]: e.target.value });
    }
  };

  // Flatten the nested chickens object into an array for easier manipulation
  const flattenedChickens = Object.values(allChickens).flatMap(farmChickens =>
    Object.entries(farmChickens).map(([id, chicken]) => ({ id, ...chicken }))
  );

  // Handle sorting of chickens
  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort chickens based on the current orderBy and order state
  // This memoized value will only recalculate when its dependencies change
  const sortedChickens = React.useMemo(() => {
    return [...flattenedChickens].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [flattenedChickens, order, orderBy]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(sortedChickens.length / ITEMS_PER_PAGE);

  // Get the chickens for the current page
  const paginatedChickens = sortedChickens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleChickenClick = (farmId, chickenId) => {
    // Navigate to individual chicken page
    navigate(`/farms/${farmId}/chickens/${chickenId}`);
  };

  const handleEditChicken = chicken => {
    setEditingChicken(chicken);
    setIsModalOpen(true);
  };

  const handleSaveChicken = async () => {
    try {
      const chickenData = editingChicken ? editingChicken : newChicken;
      const farmId = chickenData.farmId;

      if (editingChicken) {
        // Update existing chicken
        await updateChicken(farmId, chickenData.id, chickenData);
        setSnackbar({
          open: true,
          message: 'Chicken updated successfully',
          severity: 'success'
        });
      } else {
        // Add new chicken
        await addChicken(farmId, chickenData, user);

        setSnackbar({
          open: true,
          message: 'Chicken added successfully',
          severity: 'success'
        });
      }

      setIsModalOpen(false);
      setEditingChicken(null);
      setNewChicken({
        identifier: '',
        currentWeight: '',
        currentHeight: '',
        name: '',
        type: '',
        location: '',
        eggColor: '',
        dateHatched: ''
      });
      // Refresh chickens data
      await fetchChickens();
    } catch (error) {
      console.error('Error saving chicken:', error);
      setSnackbar({
        open: true,
        message: 'Error saving chicken: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleDeleteChicken = async (farmId, chickenId) => {
    try {
      await deleteChicken(farmId, chickenId);
      setSnackbar({
        open: true,
        message: 'Chicken deleted successfully',
        severity: 'success'
      });
      // Refresh chickens data
      await fetchChickens();
    } catch (error) {
      console.error('Error deleting chicken:', error);
      setSnackbar({ open: true, message: 'Error deleting chicken', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Render loading skeleton while data is being fetched
  if (loading) {
    return (
      <MainLayout title="Chickens">
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{ mb: 2 }}
            >
              <Skeleton width={200} />
            </Typography>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }}
                aria-label="chickens table"
              >
                <TableHead>
                  <TableRow>
                    {[
                      'Name',
                      'Weight',
                      'Height',
                      'Location',
                      'Egg Color',
                      'Breed',
                      'Date Hatched',
                      'Popularity',
                      'Actions'
                    ].map((header, index) => (
                      <TableCell key={index}>
                        <Skeleton
                          width={80}
                          height={40}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...Array(9)].map((_, index) => (
                    <TableRow key={index}>
                      {[...Array(9)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton
                            width={cellIndex === 8 ? 80 : '100%'}
                            height={35}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Skeleton
                width={300}
                height={40}
              />
            </Box>
          </Grid>
        </Grid>
      </MainLayout>
    );
  }

  // Render error message if there's an error
  if (error) {
    return (
      <MainLayout title="Chickens">
        <Typography color="error">{error}</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Main content */}
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={12}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            style={{ marginBottom: '16px' }}
          >
            <Grid
              item
              xs
            >
              <Typography
                variant="h4"
                component="h2"
              >
                Chickens
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
              >
                Add Chicken
              </Button>
            </Grid>
          </Grid>

          {/* Chickens table */}
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="chickens table"
            >
              {/* Table header with sortable columns */}
              <TableHead>
                <TableRow>
                  {[
                    { id: 'name', label: 'Name' },
                    { id: 'currentWeight', label: 'Weight (lbs)' },
                    { id: 'currentHeight', label: 'Height (in)' },
                    { id: 'currentLocation', label: 'Location' },
                    { id: 'eggColor', label: 'Egg Color' },
                    { id: 'type', label: 'Breed' },
                    { id: 'dateHatched', label: 'Date Hatched' },
                    { id: 'popularity', label: 'Popularity' }
                  ].map(headCell => (
                    <TableCell key={headCell.id}>
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => handleRequestSort(headCell.id)}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              {/* Table body with paginated and sorted chickens */}
              <TableBody>
                {paginatedChickens.map(chicken => (
                  <TableRow
                    key={`${chicken.id}-${chicken.name}`}
                    onClick={() => handleChickenClick(chicken.farmId, chicken.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <TableCell>{chicken.name}</TableCell>
                    <TableCell>{chicken.currentWeight}</TableCell>
                    <TableCell>{chicken.currentHeight}</TableCell>
                    <TableCell>{chicken.currentLocation}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {chicken.eggColor}
                    </TableCell>
                    <TableCell>{chicken.type}</TableCell>
                    <TableCell>{chicken.dateHatched}</TableCell>
                    <TableCell>{chicken.popularity}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation();
                          handleEditChicken(chicken);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteChicken(chicken.farmId, chicken.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination component */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Grid>
      </Grid>

      {/* Modal for adding/editing chickens */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChicken(null);
        }}
        aria-labelledby="chicken-modal"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            gutterBottom
          >
            {editingChicken ? 'Edit Chicken' : 'Add New Chicken'}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            name="identifier"
            label="Unique Identifier"
            value={editingChicken ? editingChicken.identifier : newChicken.identifier}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="currentWeight"
            label="Weight"
            type="number"
            value={
              editingChicken ? editingChicken.currentWeight : newChicken.currentWeight
            }
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="currentHeight"
            label="Height"
            type="number"
            value={
              editingChicken ? editingChicken.currentHeight : newChicken.currentHeight
            }
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={editingChicken ? editingChicken.name : newChicken.name}
            onChange={handleInputChange}
          />
          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>Breed</InputLabel>
            <Select
              name="type"
              value={editingChicken ? editingChicken.type : newChicken.type}
              onChange={handleInputChange}
            >
              <MenuItem value="Broiler">Broiler</MenuItem>
              <MenuItem value="Layer">Layer</MenuItem>
              <MenuItem value="Dual-purpose">Dual-purpose</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            name="location"
            label="Location"
            value={editingChicken ? editingChicken.location : newChicken.location}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="eggColor"
            label="Egg Color"
            value={editingChicken ? editingChicken.eggColor : newChicken.eggColor}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="dateHatched"
            label="Date Hatched"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={editingChicken ? editingChicken.dateHatched : newChicken.dateHatched}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            onClick={handleSaveChicken}
            sx={{ mt: 2 }}
          >
            {editingChicken ? 'Save Changes' : 'Add Chicken'}
          </Button>
        </Box>
      </Modal>

      {/* Snackbar for displaying success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
