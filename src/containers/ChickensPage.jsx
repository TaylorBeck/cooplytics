import { useState } from 'react';
import {
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { chickensData } from './data';

const ITEMS_PER_PAGE = 10;

export default function Chickens() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(chickensData.length / ITEMS_PER_PAGE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedData = chickensData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Typography
          variant="h4"
          component="h2"
        >
          Chickens
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            /* Add chicken logic */
          }}
        >
          Add Chicken
        </Button>
      </div>

      <TableContainer
        component={Paper}
        className="mb-8"
      >
        <Table
          sx={{ minWidth: 650 }}
          aria-label="chickens table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Breed</TableCell>
              <TableCell align="right">Age (years)</TableCell>
              <TableCell align="right">Weight (kg)</TableCell>
              <TableCell align="right">Egg Production (per year)</TableCell>
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
    </div>
  );
}
