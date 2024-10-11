'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

export default function CustomerDetailPage({ params }) {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    mem_number: '',
    interest: ''
  });

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customer/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch customer');
      const data = await response.json();
      setCustomer(data);
      setFormData({
        name: data.name,
        birth_date: new Date(data.birth_date).toISOString().split('T')[0],
        mem_number: data.mem_number,
        interest: data.interest
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/customer/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to update customer');
      fetchCustomer();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`/api/customer/${params.id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete customer');
        router.push('/customer');
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Customer Details
        </Typography>
        {isEditing ? (
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
              value={formData.birth_date}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
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
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
                Save
              </Button>
              <Button onClick={() => setIsEditing(false)} variant="outlined">
                Cancel
              </Button>
            </Box>
          </form>
        ) : (
          <>
            <Typography variant="body1"><strong>Name:</strong> {customer.name}</Typography>
            <Typography variant="body1"><strong>Birth Date:</strong> {new Date(customer.birth_date).toLocaleDateString()}</Typography>
            <Typography variant="body1"><strong>Membership Number:</strong> {customer.mem_number}</Typography>
            <Typography variant="body1"><strong>Interest:</strong> {customer.interest}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button onClick={() => setIsEditing(true)} variant="contained" color="primary" sx={{ mr: 1 }}>
                Edit
              </Button>
              <Button onClick={handleDelete} variant="contained" color="error">
                Delete
              </Button>
            </Box>
          </>
        )}
        <Box sx={{ mt: 2 }}>
          <Button onClick={() => router.push('/customer')} variant="outlined">
            Back to Customers
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
