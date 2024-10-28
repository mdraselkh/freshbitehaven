import prisma from "@/lib/db";

import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcrypt";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const userSchema = z.object({
  fullname: z
    .string()
    .min(1, { message: "Full Name is required." })
    .min(3, { message: "Full Name must be at least 3 characters." }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid phone number." }),
  // email: z
  //   .string()
  //   .min(1, { message: 'Email is required.' })
  //   .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters." }),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullname, phone, password } = userSchema.parse(body);

    const existingUserPhone = await prisma.user.findUnique({
      where: { phone: phone },
    });

    if (existingUserPhone) {
      return NextResponse.json(
        { user: null, message: "User with this phone already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        fullname,
        phone,
        password: hashedPassword,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    return NextResponse.json(
      { message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Count total orders where orderStatus is 1 (delivered)
    const totalOrders = await prisma.orderTable.count({
      where: {
        orderStatus: 1, // Only count delivered orders
      },
    });
    
    const totalUsers = await prisma.customer.count();
    const totalProducts = await prisma.products.count();

    // Calculate total sales where orderStatus is 1 (delivered)
    const totalSales = await prisma.orderTable.aggregate({
      where: {
        orderStatus: 1, // Only include delivered orders
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Calculate daily sales and orders where orderStatus is 1 (delivered)
    const dailySales = await prisma.orderTable.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        orderStatus: 1, // Only include delivered orders
      },
      _sum: {
        totalAmount: true,
      },
    });

    const dailyOrders = await prisma.orderTable.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
        orderStatus: 1, // Only include delivered orders
      },
    });

    const cardData = [
      {
        title: "Total Orders",
        value: totalOrders.toString(),
        bgColor: "bg-blue-400",
        iconbgColor: "bg-blue-600",
      },
      {
        title: "Total Users",
        value: totalUsers.toString(),
        bgColor: "bg-green-400",
        iconbgColor: "bg-green-600",
      },
      {
        title: "Total Sales",
        value: totalSales._sum.totalAmount
          ? totalSales._sum.totalAmount.toFixed(2)
          : "0.00",
        bgColor: "bg-purple-400",
        iconbgColor: "bg-purple-600",
      },
      {
        title: "Total Products",
        value: totalProducts.toString(),
        bgColor: "bg-orange-400",
        iconbgColor: "bg-orange-600",
      },
      {
        title: "Daily Orders",
        value: dailyOrders.toString(),
        bgColor: "bg-slate-400",
        iconbgColor: "bg-slate-600",
      },
      {
        title: "Daily Sales",
        value: dailySales._sum.totalAmount
          ? dailySales._sum.totalAmount.toFixed(2)
          : "0.00",
        bgColor: "bg-red-400",
        iconbgColor: "bg-red-600",
      },
    ];
    console.log("dashboard", cardData);

    return NextResponse.json(cardData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching dashboard data." },
      { status: 500 }
    );
  }
}

