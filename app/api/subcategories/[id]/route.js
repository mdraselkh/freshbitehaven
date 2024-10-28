import prisma from "@/lib/db"; // Adjust the import according to your setup
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

export async function PUT(req, { params }) {
  const { id } = params; // Get the ID from the URL parameters

  try {
    const formData = await req.formData(); // Use formData to get the fields
    const name = formData.get("name");
    const image = formData.get("image"); // This should be a File object
    const categoryId = formData.get("categoryId");

    // Prepare the data for update
    const data = {
      name,
      categoryId: Number(categoryId), // Ensure categoryId is a number
    };

    // Handle image upload if needed (e.g., save to cloud storage and get the URL)
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imagePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        image.name
      );
      fs.writeFileSync(imagePath, imageBuffer);
      data.image = `/uploads/${image.name}`;
    }

    // Update the subcategory in the database
    const updatedSubCategory = await prisma.subCategory.update({
      where: { id: Number(id) }, // Ensure ID is a number
      data,
    });

    return NextResponse.json(updatedSubCategory, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update subcategory" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // Get the ID from the URL parameters

  try {
    // Delete the subcategory from the database
    await prisma.subCategory.delete({
      where: { id: Number(id) }, // Ensure ID is a number
    });

    return NextResponse.json(
      { message: "Subcategory deleted successfully" },
      { status: 200}
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete subcategory" },
      { status: 500 }
    );
  }
}
