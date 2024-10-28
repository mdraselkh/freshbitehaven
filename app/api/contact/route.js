import prisma from '@/lib/db';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';


export async function POST(req) {
  const { name, phone, email, message } = await req.json();

  try {

    await prisma.contactForm.create({
      data: { name, phone, email, message },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,   
      },
    });


    const mailOptions = {
      from: email,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
    };


    await transporter.sendMail(mailOptions);
    return NextResponse.json({mailOptions, message: 'Email sent and data saved successfully!' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error saving data or sending email' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
