'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Link, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function CustomerPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    mem_number: '',
    interest: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const response = await fetch('/api/customer');
    const data = await response.json();
    setCustomers(data);
  };

  const handleOpen = (customer = null) => {
    setSelectedCustomer(customer);
    setFormData(customer || {
      name: '',
      birth_date: '',
      mem_number: '',
      interest: ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCustomer(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = selectedCustomer ? `/api/customer/${selectedCustomer._id}` : '/api/customer';
    const method = selectedCustomer ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    handleClose();
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/customer/${id}`, { method: 'DELETE' });
    fetchCustomers();
  };

  const handleCustomerClick = (id) => {
    router.push(`/customer/${id}`);
  };

  return (
    <div>
      <h1>Customer Management</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add New Customer
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Birth Date</TableCell>
              <TableCell>Membership Number</TableCell>
              <TableCell>Interest</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>
                  <Link href={`/customer/${customer._id}`} passHref>
                    <Typography
                      component="span"
                      sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {customer.name}
                    </Typography>
                  </Link>
                </TableCell>
                <TableCell>{new Date(customer.birth_date).toLocaleDateString()}</TableCell>
                <TableCell>{customer.mem_number}</TableCell>
                <TableCell>{customer.interest}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpen(customer)}>Edit</Button>
                  <Button onClick={() => handleDelete(customer._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="birth_date"
              label="Birth Date"
              type="date"
              value={formData.birth_date ? new Date(formData.birth_date).toISOString().split('T')[0] : ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0] // Prevents future dates
              }}
            />
            <TextField
              name="mem_number"
              label="Membership Number"
              value={formData.mem_number}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="interest"
              label="Interest"
              value={formData.interest}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" color="primary">
                {selectedCustomer ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
