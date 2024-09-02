import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ref, get } from 'firebase/database';
import { db } from '../api/firebaseConfig';
import MainLayout from '../components/layout/MainLayout';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  CircularProgress,
  Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const Row = ({ order }) => {
  const [open, setOpen] = useState(false);

  const orderSteps = ['Received', 'Paid', 'Processing', 'Shipped', 'Delivered'];

  const getActiveStep = status => {
    switch (status) {
      case 'received':
        return 0;
      case 'paid':
        return 1;
      case 'processing':
        return 2;
      case 'shipped':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const activeStep = getActiveStep(order.status);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
        >
          {order.id}
        </TableCell>
        <TableCell align="right">{order.customerId}</TableCell>
        <TableCell align="right">{order.orderDate}</TableCell>
        <TableCell align="right">{order.status}</TableCell>
        <TableCell align="right">${order.totalAmount}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
              >
                Order Details
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell align="right">Price ($)</TableCell>
                    <TableCell align="right">Total ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(order.items).map(([itemName, item]) => (
                    <TableRow key={itemName}>
                      <TableCell
                        component="th"
                        scope="row"
                      >
                        {itemName}
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell align="right">{item.price}</TableCell>
                      <TableCell align="right">
                        {(item.quantity * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ mt: 2 }}
              >
                Order Status
              </Typography>
              <Box sx={{ width: '100%', my: 2 }}>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                >
                  {orderSteps.map(label => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.uid) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const ordersRef = ref(db, 'orders');
        const ordersSnapshot = await get(ordersRef);

        if (ordersSnapshot.exists()) {
          const ordersData = ordersSnapshot.val();
          const ordersArray = Object.entries(ordersData).map(([id, order]) => ({
            id,
            ...order
          }));
          setOrders(ordersArray);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Error fetching orders data');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const exportToCSV = () => {
    const headers = [
      'Order ID',
      'Customer ID',
      'Order Date',
      'Status',
      'Total Amount',
      'Items'
    ];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => {
        const itemsString = Object.entries(order.items)
          .map(([name, { quantity, price }]) => `${name}(${quantity}x$${price})`)
          .join('; ');
        return [
          order.id,
          order.customerId,
          order.orderDate,
          order.status,
          order.totalAmount,
          `"${itemsString}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'orders.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%'
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
        <Box sx={{ width: '100%' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ width: '100%', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography
            variant="h4"
            component="h2"
          >
            Orders
          </Typography>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={exportToCSV}
          >
            Export CSV
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Order ID</TableCell>
                <TableCell align="right">Customer ID</TableCell>
                <TableCell align="right">Order Date</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <Row
                  key={order.id}
                  order={order}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainLayout>
  );
}
