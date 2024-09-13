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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const initialChickenState = {
  identifier: '',
  currentWeight: '',
  currentHeight: '',
  name: '',
  type: '',
  location: '',
  eggColor: 'White',
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

  const handleDateChange = date => {
    setChickenData({
      ...chickenData,
      dateHatched: date ? date.format('YYYY-MM-DD') : null
    });
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
          label="Weight (lbs)"
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
          variant="outlined"
        >
          <InputLabel>Breed</InputLabel>
          <Select
            name="type"
            value={chickenData.type}
            onChange={handleInputChange}
            label="Breed"
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
        <FormControl
          fullWidth
          margin="normal"
        >
          <Typography
            variant="body1"
            component="label"
            gutterBottom
          >
            Egg Color
          </Typography>
          <RadioGroup
            row
            name="eggColor"
            value={chickenData.eggColor}
            onChange={handleInputChange}
          >
            <FormControlLabel
              value="White"
              control={<Radio />}
              label="White"
            />
            <FormControlLabel
              value="Brown"
              control={<Radio />}
              label="Brown"
            />
            <FormControlLabel
              value="Other"
              control={<Radio />}
              label="Other"
            />
          </RadioGroup>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Date Hatched"
            value={chickenData.dateHatched ? dayjs(chickenData.dateHatched) : null}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal'
              }
            }}
          />
        </LocalizationProvider>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSave}
          >
            {chicken ? 'Save Changes' : 'Add Chicken'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
