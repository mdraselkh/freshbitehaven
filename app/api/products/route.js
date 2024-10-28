import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();

    // Extract form data values
    const imageFile = data.get("image");
    const categoryName = data.get("category");
    const subcategoryName = data.get("subcategory");
    const name = data.get("name");
    const localName = data.get("localName");
    const description = data.get("description");
    const sizes = JSON.parse(data.get("sizes"));
    const stock = parseInt(data.get("stock"), 10);
    const status = data.get("status");
    const isBestSelling = data.get("isBestSelling") === "true";
    const isFeatured = data.get("isFeatured") === "true";
    const isNewArrival = data.get("isNewArrival") === "true";
    const isOnOffer = data.get("isOnOffer") === "true";

    // Validate required fields
    if (!name || !categoryName || !sizes.length || !imageFile || isNaN(stock)) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Find the category by name
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { message: `Category "${categoryName}" not found.` },
        { status: 404 }
      );
    }
    let subcategoryId = null;
    if (subcategoryName) {
      const subcategory = await prisma.subCategory.findFirst({
        where: { name: subcategoryName },
      });
      if (subcategory) {
        subcategoryId = subcategory.id; // Assign the subcategory ID if found
      }
    }

    // Format sizes for Prisma
    const formattedSizes = sizes.map((size) => ({
      weight: size.weight,
      price: parseFloat(size.price),
      discountPrice: size.discountPrice ? parseFloat(size.discountPrice) : null,
    }));

    // Handle image upload
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imagePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      imageFile.name
    );

    // Save image to the server
    fs.writeFileSync(imagePath, imageBuffer);

    const product = await prisma.products.create({
      data: {
        image: `/uploads/${imageFile.name}`,
        categoryId: category.id,
        subcategoryId: subcategoryId || undefined, // Only include if exists
        name,
        localName,
        description,
        stock, // Add stock field
        status, // Add status field
        isBestSelling, // Add product type flags
        isFeatured,
        isNewArrival,
        isOnOffer,
        sizes: {
          create: formattedSizes, // Create sizes associated with the product
        },
      },
    });

    // console.log(product);

    // Return success response
    return NextResponse.json(
      { product, message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const products = await prisma.products.findMany({
      include: {
        sizes: true, // Include product sizes
        category: {
          // Include category with only the name field
          select: {
            name: true,
          },
        },
        subcategory: {
          // Include subcategory with only the name field
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(products, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Product ID is required." },
      { status: 400 }
    );
  }

  try {
    await prisma.size.deleteMany({
      where: {
        productId: parseInt(id),
      },
    });

    await prisma.products.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const data = await req.formData();

    const productId = data.get("productId");
    const imageFile = data.get("image");
    const categoryName = data.get("category");
    const subcategoryName = data.get("subcategory");
    const name = data.get("name");
    const localName = data.get("localName");
    const description = data.get("description");
    const sizes = JSON.parse(data.get("sizes"));
    const stock = parseInt(data.get("stock"), 10);
    const status = data.get("status");
    const isBestSelling = data.get("isBestSelling") === "true";
    const isFeatured = data.get("isFeatured") === "true";
    const isNewArrival = data.get("isNewArrival") === "true";
    const isOnOffer = data.get("isOnOffer") === "true";

    const prodId = parseInt(productId);

    // Validate required fields
    if (
      !prodId ||
      !name ||
      !categoryName ||
      !sizes.length ||
      isNaN(stock) ||
      !imageFile
    ) {
      return NextResponse.json(
        { message: "All fields except image are required." },
        { status: 400 }
      );
    }

    // Find the category and subcategory by name
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return NextResponse.json(
        { message: `Category "${categoryName}" not found.` },
        { status: 404 }
      );
    }

    let subcategoryId = null;
    if (subcategoryName) {
      const subcategory = await prisma.subCategory.findFirst({
        where: { name: subcategoryName },
      });
      if (subcategory) {
        subcategoryId = subcategory.id; // Assign the subcategory ID if found
      }
    }

    // Format sizes for Prisma
    const formattedSizes = sizes.map((size) => ({
      weight: size.weight,
      price: parseFloat(size.price),
      discountPrice: size.discountPrice ? parseFloat(size.discountPrice) : null,
    }));

    // Prepare updated product data
    let updatedData = {
      categoryId: category.id,
      subcategoryId: subcategoryId,
      name,
      localName,
      description,
      stock, // Add stock field
      status, // Add status field
      isBestSelling, // Add product type flags
      isFeatured,
      isNewArrival,
      isOnOffer,
    };

    // Handle image update
    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        imageFile.name
      );
      fs.writeFileSync(imagePath, imageBuffer);
      updatedData.image = `/uploads/${imageFile.name}`;
    }

    // Update the product in the database
    const updatedProduct = await prisma.products.update({
      where: { id: prodId },
      data: updatedData,
    });

    // Delete existing sizes associated with the product
    await prisma.size.deleteMany({
      where: { productId: prodId },
    });

    // Create new sizes for the product
    await prisma.size.createMany({
      data: formattedSizes.map((size) => ({ ...size, productId: prodId })),
    });

    return NextResponse.json(
      { product: updatedProduct, message: "Product updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Failed to update product", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client is disconnected
  }
}
