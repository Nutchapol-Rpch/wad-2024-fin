import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Customer from '../../../../models/Customer';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params.id;
  const customer = await Customer.findById(id);
  return NextResponse.json(customer);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const id = params.id;
  
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    
    if (!deletedCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Customer deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting customer' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const id = params.id;
  const updateData = await request.json();
  
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json({ error: 'Error updating customer' }, { status: 500 });
  }
}