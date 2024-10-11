import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Customer from '../../../models/Customer';

export async function GET(request) {
  await dbConnect();
  const customers = await Customer.find({});
  return NextResponse.json(customers);
}

export async function POST(request) {
  await dbConnect();
  const data = await request.json();
  const customer = await Customer.create(data);
  return NextResponse.json(customer);
}

export async function PUT(request) {
  await dbConnect();
  const { id, ...updateData } = await request.json();
  const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json(customer);
}

