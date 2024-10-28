
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';

export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.formData();

  const name = body.get('name');
  const description = body.get('description');
  const imageFile = body.get('image');

  try {
    const updatedData = { name, description };

    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imagePath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);
      fs.writeFileSync(imagePath, imageBuffer);
      updatedData.image = `/uploads/${imageFile.name}`;
    }

    // Update the category in the database
    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
    const { id } = params;
  
    try {
      await prisma.category.delete({
        where: { id: Number(id) },
      });
  
      return NextResponse.json(null, { status: 200 }); 
    } catch (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
    }
  }
