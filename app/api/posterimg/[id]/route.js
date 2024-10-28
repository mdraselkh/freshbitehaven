

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';


export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const data = await req.formData();
    const imageFile = data.get('image');

    // Validate if the image file exists
    if (!imageFile) {
      return NextResponse.json({ message: 'An image is required to update.' }, { status: 400 });
    }

    // Create the file path for saving the image
    const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imgPath = path.join(process.cwd(), 'public', 'uploads', imageFile.name);
    
    // Save the new image to the uploads folder
    fs.writeFileSync(imgPath, imgBuffer);

    // Find the existing poster image in the database
    const existingImage = await prisma.posterImage.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingImage) {
      return NextResponse.json({ message: 'Image not found.' }, { status: 404 });
    }

    // Optionally delete the old image file
    const oldImgPath = path.join(process.cwd(), 'public', existingImage.images);
    if (fs.existsSync(oldImgPath)) {
      fs.unlinkSync(oldImgPath); // Delete the old image file
    }

    // Update the image path in the database
    const updatedPosterImage = await prisma.posterImage.update({
      where: { id: parseInt(id) },
      data: {
        images: `/uploads/${imageFile.name}`,
      },
    });

    return NextResponse.json({ updatedPosterImage, message: 'Poster Image updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}



export async function DELETE(req, { params }) {
    const { id } = params; // Get the image ID from the URL parameters
  
    try {
      // Find the existing poster image in the database
      const existingImage = await prisma.posterImage.findUnique({
        where: { id: parseInt(id) },
      });
  
      if (!existingImage) {
        return NextResponse.json({ message: 'Image not found.' }, { status: 404 });
      }
  
      // Delete the image file from the uploads folder
      const imgPath = path.join(process.cwd(), 'public', existingImage.images);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath); // Delete the image file
      }
  
      // Remove the image record from the database
      await prisma.posterImage.delete({
        where: { id: parseInt(id) },
      });
  
      return NextResponse.json({ message: 'Poster Image deleted successfully.' }, { status: 200});
    } catch (error) {
      console.error('Error deleting image:', error);
      return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
  }
  