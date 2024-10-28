import prisma from '@/lib/db';
import { NextResponse } from 'next/server';


export async function PUT(request, { params }) {
    const { id } = params;
    const { city, cost } = await request.json();
  
    if (!id || !city || cost === undefined) {
      return new NextResponse(JSON.stringify({ error: 'City and cost are required.' }), { status: 400 });
    }
  
    try {
    
      const updatedShippingCost = await prisma.shippingCost.update({
        where: { id: parseInt(id, 10) },
        data: { city, cost },
      });
  
      return new NextResponse(JSON.stringify(updatedShippingCost), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      console.error('Error updating shipping cost:', error);
      return new NextResponse(JSON.stringify({ error: 'Failed to update shipping cost.' }), { status: 500 });
    }
  }

