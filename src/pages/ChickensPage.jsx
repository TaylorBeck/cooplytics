import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ref, get, onValue, query, orderByKey } from 'firebase/database';
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
  Skeleton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useChickens } from '../hooks/useChickens';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

export default function Chickens() {
  const user = useSelector(state => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newChicken, setNewChicken] = useState({
    identifier: '',
    weight: '',
    height: '',
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

  const { addChicken, updateChicken, deleteChicken } = useChickens();

  useEffect(() => {
    const fetchChickens = async () => {
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
          const chickensData = {};

          // Fetch chickens for each farm the user has access to
          for (const farmId of Object.keys(userFarms)) {
            const farmChickensRef = ref(db, `chickens/${farmId}`);
            const farmChickensQuery = query(farmChickensRef, orderByKey());

            onValue(
              farmChickensQuery,
              snapshot => {
                if (snapshot.exists()) {
                  chickensData[farmId] = snapshot.val();
                }
                setAllChickens(chickensData);
                setLoading(false);
              },
              error => {
                console.error(`Error fetching chickens for farm ${farmId}:`, error);
                setError(error.message);
                setLoading(false);
              }
            );
          }
        } else {
          setAllChickens({});
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user farms:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchChickens();
  }, [user]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddChicken = async () => {
    setIsModalOpen(false);
    setNewChicken({
      identifier: '',
      weight: '',
      height: '',
      name: '',
      type: '',
      location: '',
      eggColor: '',
      dateHatched: ''
    });
  };

  const handleInputChange = e => {
    setNewChicken({ ...newChicken, [e.target.name]: e.target.value });
  };

  const flattenedChickens = Object.values(allChickens).flatMap(farmChickens =>
    Object.entries(farmChickens).map(([id, chicken]) => ({ id, ...chicken }))
  );

  const totalPages = Math.ceil(flattenedChickens.length / ITEMS_PER_PAGE);

  const paginatedChickens = flattenedChickens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleChickenClick = (farmId, chickenId) => {
    navigate(`/farms/${farmId}/chickens/${chickenId}`);
  };

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
                      {[...Array(8)].map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton
                            width={cellIndex === 7 ? 80 : '100%'}
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

  if (error) {
    return (
      <MainLayout title="Chickens">
        <Typography color="error">{error}</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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

          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="chickens table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Weight (lbs)</TableCell>
                  <TableCell>Height (in)</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Egg Color</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Date Hatched</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedChickens.map(chicken => (
                  <TableRow
                    key={chicken.id}
                    onClick={() => handleChickenClick(chicken.farmId, chicken.id)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <TableCell>{chicken.name}</TableCell>
                    <TableCell>1.2</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>{chicken.currentLocation}</TableCell>
                    <TableCell sx={{ textTransform: 'capitalize' }}>
                      {chicken.eggColor}
                    </TableCell>
                    <TableCell>{chicken.type}</TableCell>
                    <TableCell>{chicken.dateHatched}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation();
                          /* Edit logic */
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={e => {
                          e.stopPropagation();
                          deleteChicken(chicken.id);
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
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
          />
        </Grid>
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="add-chicken-modal"
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
            Add New Chicken
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            name="identifier"
            label="Unique Identifier"
            value={newChicken.identifier}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="weight"
            label="Weight"
            type="number"
            value={newChicken.weight}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="height"
            label="Height"
            type="number"
            value={newChicken.height}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={newChicken.name}
            onChange={handleInputChange}
          />
          <FormControl
            fullWidth
            margin="normal"
          >
            <InputLabel>Breed</InputLabel>
            <Select
              name="type"
              value={newChicken.type}
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
            value={newChicken.location}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="eggColor"
            label="Egg Color"
            value={newChicken.eggColor}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="dateHatched"
            label="Date Hatched"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newChicken.dateHatched}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            onClick={handleAddChicken}
            sx={{ mt: 2 }}
          >
            Add Chicken
          </Button>
        </Box>
      </Modal>
    </MainLayout>
  );
}
