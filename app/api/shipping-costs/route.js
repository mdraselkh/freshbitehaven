import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const shippingCosts = await prisma.shippingCost.findMany();
    
    return NextResponse.json(shippingCosts, { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error fetching shipping costs:', error);
    return NextResponse.json({ message: 'Failed to retrieve shipping costs.' }, { status: 500 });
  }
}


export async function POST(request) {
  try {
    const { city, cost } = await request.json();

    if (!city || cost == null) {
      return NextResponse.json({ error: 'City and cost are required' }, { status: 400 });
    }

    const newShippingCost = await prisma.shippingCost.create({
      data: {
        city,
        cost,
      },
    });

    console.log('newShippingCost', newShippingCost);
    return NextResponse.json(newShippingCost, { status: 201 });
  } catch (error) {
    console.error('Error creating shipping cost:', error);
    return NextResponse.json({ error: 'Failed to create shipping cost', details: error.message }, { status: 500 });
  }
}
