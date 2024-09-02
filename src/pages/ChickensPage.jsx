import { useState } from 'react';
import { useDispatch } from 'react-redux';

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
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { chickensData } from './data';
import { addChicken } from '../redux/slices/chickenSlice';

const ITEMS_PER_PAGE = 10;

export default function Chickens() {
  const dispatch = useDispatch();
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

  const totalPages = Math.ceil(chickensData.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddChicken = () => {
    dispatch(addChicken(newChicken));
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

  const paginatedData = chickensData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <MainLayout>
      <div>
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
            sx={{ minWidth: 650, width: '100%' }}
            aria-label="chickens table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Breed</TableCell>
                <TableCell align="right">Age (years)</TableCell>
                <TableCell align="right">Weight (kg)</TableCell>
                <TableCell align="right">Egg Production (per year)</TableCell>
                <TableCell align="right">Eggs per day</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map(chicken => (
                <TableRow
                  key={chicken.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {chicken.name}
                  </TableCell>
                  <TableCell>{chicken.breed}</TableCell>
                  <TableCell align="right">{chicken.age}</TableCell>
                  <TableCell align="right">{chicken.weight}</TableCell>
                  <TableCell align="right">{chicken.eggProduction}</TableCell>
                  <TableCell align="right">150</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        /* Edit chicken logic */
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        /* Delete chicken logic */
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
          variant="outlined"
          shape="rounded"
          className="mt-4" // Add margin-top for spacing
          sx={{ marginTop: 2 }} // Additional margin for better spacing
        />
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
              <InputLabel>Type</InputLabel>
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
      </div>
    </MainLayout>
  );
}
