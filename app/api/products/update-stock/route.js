import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const data = await req.json();
    const { cartItem } = data; // Expecting an array of cart items with product IDs and quantities
    console.log(cartItem);
    // Validate input
    if (!Array.isArray(cartItem) || cartItem.length === 0) {
      return NextResponse.json(
        { message: "Cart items are required." },
        { status: 400 }
      );
    }

    const updates = cartItem.map(async (item) => {
      const { productId, quantity } = item;

      // Update the product stock in the database
      const product = await prisma.products.update({
        where: { id: productId },
        data: {
          stock: {
            decrement: quantity, // Decrease stock by the quantity in cart
          },
        },
      });

      return product; // Return updated product
    });

    // Wait for all updates to complete
    await Promise.all(updates);

    // Return success response
    return NextResponse.json(
      {updates, message: "Stock updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
