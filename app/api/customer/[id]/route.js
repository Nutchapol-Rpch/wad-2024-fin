import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Customer from '../../../../models/Customer';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  const customer = await Customer.findById(id);
  return NextResponse.json(customer);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;
  const data = await request.json();
  const customer = await Customer.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(customer);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  await Customer.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Customer deleted successfully' });
}