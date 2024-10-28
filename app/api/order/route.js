import { NextResponse } from 'next/server';
import prisma from '@/lib/db';


export async function POST(req) {
  const body = await req.json();
  const { customer, totalAmount,orderNote,discount, orderItems, paymentMethod, shippingCostId } = body;


  let customerId;



  if (typeof customer === 'object' && customer.phone) {
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone: customer.phone },
    });

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      try {
        const newCustomer = await prisma.customer.create({
          data: {
            fullname: customer.fullname,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
          },
        });
        customerId = newCustomer.id;
      } catch (error) {
        console.error('Error creating new customer:', error);
        return NextResponse.json({ message: 'Failed to create customer' }, { status: 500 });
      }
    }
  }

  let payment = await prisma.payment.findFirst({
    where: { method: paymentMethod, customerId: customerId },
  });

  if (payment) {
    payment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        amount: totalAmount,
        status: 'Received',
      },
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        method: paymentMethod,
        amount: totalAmount,
        status: 'Received',
        customer: { connect: { id: customerId } },
      },
    });
  }

  try {
    const order = await prisma.orderTable.create({
      data: {
        customer: { connect: { id: customerId } },
        totalAmount,
        orderNote,
        discount,
        ShippingCost: { connect: { id: shippingCostId } },
        Payment: { connect: { id: payment.id } },
        orderItems: {
          create: orderItems.map((item) => ({
            productName: item.productName, 
            weight: item.weight,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json({ success: true, order, message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}



export async function GET() {
  try {
    const orders = await prisma.orderTable.findMany({
      include: {
        orderItems: true, // Directly include order items
        ShippingCost: true,
        Payment: true,
        customer: true,
      },
    });

    console.log('Fetched orders:', orders);

    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderDate: order.createdAt,
      userName: order.customer.fullname,
      userPhone: order.customer.phone,
      shippingCost: order.ShippingCost ? order.ShippingCost.cost : 0,
      totalAmount: order.totalAmount || 0,
      orderNote:order.orderNote,
      discount:order.discount,
      orderStatus: order.orderStatus || 0,
      paymentStatus: order.Payment ? order.Payment.status : null,
      orderItems: order.orderItems.map((item) => ({
        productName: item.productName,
        price: item.price || item.discountPrice,
        weight: item.weight || 'N/A',
        quantity: item.quantity || 0, 
        totalPrice: item.totalPrice || 0, 
      })),
    }));

    return NextResponse.json({ orders: formattedOrders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: error.message }, { status: 500 });
  }
}

