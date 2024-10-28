import prisma from '@/lib/db'; // Adjust the import path based on your project structure
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// POST method to create a subcategory
export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get('name');
    const imageFile = formData.get('image');
    const categoryId = formData.get('categoryId'); // Get category ID from form data

    if (!name || !imageFile || !categoryId) {
      return NextResponse.json({ message: 'Name, category ID, and image are required.' }, { status: 400 });
    }

    // Save image to public/uploads
    const imagePath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    fs.writeFileSync(imagePath, imageBuffer);

    // Create subcategory in the database
    const subcategory = await prisma.subCategory.create({
      data: {
        name,
        categoryId: parseInt(categoryId), // Ensure categoryId is an integer
        image: `/uploads/${imageFile.name}`,
      },
    });

    return NextResponse.json({ subcategory, message: 'Subcategory created successfully' }, { status: 201 });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}

// GET method to fetch all subcategories
export async function GET() {
  try {
    const subcategories = await prisma.subCategory.findMany({
      include: {
        category: true, // Include category data if needed
      },
    });
    return NextResponse.json(subcategories, { status: 200 });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ message: 'Error fetching subcategories.' }, { status: 500 });
  }
}
