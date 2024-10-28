import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(req) {
  try {
    const { phone } = await req.json(); 

    if (!phone) {
      return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req){
  try {
    
    const usersWithOrders = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, 
        },
      },
    });

    const uniqueUsers = new Map();


    usersWithOrders.forEach(user => {
      if (!uniqueUsers.has(user.id)) {
        uniqueUsers.set(user.id, {
          id: user.id,
          fullname: user.fullname,
          phone: user.phone,
          address: user.address,
          lastOrderDate: user.orders.length > 0 ? user.orders[0].createdAt : null,
        });
      }
    });

    
    const formattedUsers = Array.from(uniqueUsers.values());

    console.log(formattedUsers);

    return NextResponse.json(formattedUsers, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", // Prevent caching
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: 'An error occurred while fetching user details.' },
      { status: 500 }
    );
  }
}
