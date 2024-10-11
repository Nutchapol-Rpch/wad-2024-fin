"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

export default function CustomerDetail({ params }) {
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    mem_number: '',
    interest: ''
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/customer/${params.id}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error('Failed to fetch customer data');
        }
        const data = await response.json();
        console.log("Fetched customer data:", data); // Add this line
        setCustomer(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

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
      if (response.ok) {
        const updatedCustomer = await response.json();
        setCustomer(updatedCustomer);
        setFormData(updatedCustomer);
        setEditMode(false);
        alert('Customer updated successfully');
      } else {
        throw new Error('Failed to update customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  };

  const handleBack = () => {
    router.push('/customer');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("Current customer state:", customer); // Add this line

  if (!customer) {
    return <div>No customer data found</div>;
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4">Customer Details</h1>
      {editMode ? (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
          <div className="flex justify-end mt-4">
            <Button type="submit" variant="contained" color="primary" className="mr-2">
              Save
            </Button>
            <Button onClick={() => setEditMode(false)} variant="outlined">
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <p className="mb-2"><span className="font-bold">Name:</span> {customer.name}</p>
          <p className="mb-2"><span className="font-bold">Birth Date:</span> {new Date(customer.birth_date).toLocaleDateString()}</p>
          <p className="mb-2"><span className="font-bold">Membership Number:</span> {customer.mem_number}</p>
          <p className="mb-2"><span className="font-bold">Interest:</span> {customer.interest}</p>
          <div className="mt-4">
            <Button onClick={() => setEditMode(true)} variant="contained" color="primary" className="mr-2">
              Edit
            </Button>
          </div>
        </div>
      )}
      <Button
        onClick={handleBack}
        variant="outlined"
        className="mt-4"
      >
        Back to Customers
      </Button>
    </div>
  );
}
