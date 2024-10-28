import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.formData();
    const imageFile = data.get('image'); // Change 'images' to 'image' to match form input name

    // Validate if the image file exists
    if (!imageFile) {
      return NextResponse.json({ message: 'At least one image is required.' }, { status: 400 });
    }

    // Create the file path for saving the image
    const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imgPath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);
    
    // Save the image to the uploads folder
    fs.writeFileSync(imgPath, imgBuffer);

    // Store the image path in the database
    const newPosterImage = await prisma.posterImage.create({
      data: {
        images: `/uploads/${imageFile.name}`,
      },
    });

    return NextResponse.json({ newPosterImage, message: 'Poster Image uploaded successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
 
    const posterImages = await prisma.posterImage.findMany(); 

    return NextResponse.json(posterImages, { status: 200 });
  } catch (error) {
    console.error('Error fetching poster images:', error);
    return NextResponse.json({ message: 'Error fetching poster image data.' }, { status: 500 });
  }
}
