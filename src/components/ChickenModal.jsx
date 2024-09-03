import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

const initialChickenState = {
  identifier: '',
  currentWeight: '',
  currentHeight: '',
  name: '',
  type: '',
  location: '',
  eggColor: '',
  dateHatched: ''
};

export default function ChickenModal({ open, onClose, onSave, chicken }) {
  const [chickenData, setChickenData] = useState(initialChickenState);

  useEffect(() => {
    if (chicken) {
      setChickenData(chicken);
    } else {
      setChickenData(initialChickenState);
    }
  }, [chicken]);

  const handleInputChange = e => {
    setChickenData({ ...chickenData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(chickenData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          {chicken ? 'Edit Chicken' : 'Add New Chicken'}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          name="identifier"
          label="Unique Identifier"
          value={chickenData.identifier}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="currentWeight"
          label="Weight"
          type="number"
          value={chickenData.currentWeight}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="currentHeight"
          label="Height"
          type="number"
          value={chickenData.currentHeight}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Name"
          value={chickenData.name}
          onChange={handleInputChange}
        />
        <FormControl
          fullWidth
          margin="normal"
        >
          <InputLabel>Breed</InputLabel>
          <Select
            name="type"
            value={chickenData.type}
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
          value={chickenData.location}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="eggColor"
          label="Egg Color"
          value={chickenData.eggColor}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="dateHatched"
          label="Date Hatched"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={chickenData.dateHatched}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          {chicken ? 'Save Changes' : 'Add Chicken'}
        </Button>
      </Box>
    </Modal>
  );
}
