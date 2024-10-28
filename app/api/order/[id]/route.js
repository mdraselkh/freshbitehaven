// app/api/order/[id]/route.js

import prisma from '@/lib/db';
import { NextResponse } from 'next/server';


export async function PATCH(request, { params }) {
  const { id } = params; // Get order ID from URL
  const { orderStatus } = await request.json(); // Get new order status from request body

  try {
    // Update order status in the database
    const updatedOrder = await prisma.orderTable.update({
      where: { id: Number(id) }, // Use Number(id) to match the database type
      data: { orderStatus }, // Update only the orderStatus field
    });

    return NextResponse.json({ order: updatedOrder }, { status: 200 });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status', details: error.message }, { status: 500 });
  }
}
