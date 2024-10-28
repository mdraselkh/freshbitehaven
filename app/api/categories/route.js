import prisma from '@/lib/db';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';



export async function POST(req) {
    try {
      const formData = await req.formData();
  
      const name = formData.get('name');
      const description = formData.get('description');
      const imageFile = formData.get('image');
  
      if (!name || !imageFile) {
        return NextResponse.json({ message: 'Name and image are required.' }, { status: 400 });
      }
  
      const imagePath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      fs.writeFileSync(imagePath, imageBuffer);
  
      const category = await prisma.category.create({
        data: {
          name,
          description,
          image: `/uploads/${imageFile.name}`,
        },
      });
  
      return NextResponse.json({ category, message: 'Category created successfully' }, { status: 201 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
  }

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching categories.' }, { status: 500 });
  }
}
