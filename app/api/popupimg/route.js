import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.formData();
    const imageFile = data.get('image'); 


    if (!imageFile) {
      return NextResponse.json({ message: 'At least one image is required.' }, { status: 400 });
    }


    const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imgPath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);
    
    fs.writeFileSync(imgPath, imgBuffer);

    const newPopupImage = await prisma.popupImage.create({
      data: {
        image: `/uploads/${imageFile.name}`,
      },
    });

    return NextResponse.json({ newPopupImage, message: 'PopUp Image uploaded successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET(req) {
    try {
      const latestPopupImage = await prisma.popupImage.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      if (!latestPopupImage) {
        return NextResponse.json({ message: 'No popup image found.' }, { status: 404 });
      }
  
      return NextResponse.json(latestPopupImage, { status: 200 });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error fetching popup image.' }, { status: 500 });
    }
  }