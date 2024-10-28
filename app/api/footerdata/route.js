import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';



export async function POST(req) {
  const formData = await req.formData();

  const hotline = formData.get('hotline');
  const title = formData.get('title');
  const logoFile = formData.get('logo');
  const address = formData.get('address');
  const whatsapp = formData.get('whatsapp');
  const website = formData.get('website');
  const email = formData.get('email') || null;
  const branchName = formData.get('branchName');
  const branchAddress = formData.get('branchAddress');
  const locationSrc = formData.get('locationSrc');

  if (!hotline || !title || !logoFile || !address || !whatsapp || !website || !locationSrc) {
    return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
  }

  const logoPath = path.join(process.cwd(), 'public', 'uploads', logoFile.name);
  const logoBuffer = Buffer.from(await logoFile.arrayBuffer());
  fs.writeFileSync(logoPath, logoBuffer);

  try {
    const footerData = await prisma.footerSection.create({
      data: {
        hotline,
        title,
        logo: `/uploads/${logoFile.name}`,
        address,
        whatsapp,
        website,
        email,
        branchName,
        branchAddress,
        locationSrc,
      },
    });

    return NextResponse.json({ footerData, message: 'Footer contact data submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error saving footer contact data.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const footerData = await prisma.footerSection.findMany(); 

    return NextResponse.json(footerData, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching footer data.' }, { status: 500 });
  }
}
