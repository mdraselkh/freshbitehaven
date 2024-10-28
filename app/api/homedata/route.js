import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.formData();

    const hotline = data.get('hotline');
    const email = data.get('email');
    const logoFile = data.get('logo');


    if (!hotline || !email || !logoFile) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }


    const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
    const logoPath = path.join(process.cwd(), 'public', 'uploads', logoFile.name);
    fs.writeFileSync(logoPath, logoBuffer);


    const newHomeSection = await prisma.homeSection.create({
      data: {
        hotline,
        email,
        logo: `/uploads/${logoFile.name}`,
      
      },
    });

    return NextResponse.json({ newHomeSection, message: 'Home section data created successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    const homeData = await prisma.homeSection.findMany(); 

    return NextResponse.json(homeData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching home data.' }, { status: 500 });
  }
}

