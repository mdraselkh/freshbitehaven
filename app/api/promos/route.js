import prisma from '@/lib/db';
import { NextResponse } from 'next/server';


// GET: Fetch all promos
export async function GET() {
  try {
    const promos = await prisma.promo.findMany();
    return NextResponse.json(promos, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching promos' }, { status: 500 });
  }
}

// POST: Create a new promo
export async function POST(request) {
  const { code, discountPercentage, validFrom, validUntil, isActive } = await request.json();

  if (!code || !discountPercentage) {
    return NextResponse.json({ error: 'Promo code and discount percentage are required' }, { status: 400 });
  }

  try {
    const newPromo = await prisma.promo.create({
      data: {
        code,
        discountPercentage,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive,
      },
    });
    return NextResponse.json(newPromo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating promo' }, { status: 500 });
  }
}

export async function PUT(request) {
  const { id, code, discountPercentage, validFrom, validUntil, isActive } = await request.json();

  if (!id || !code || !discountPercentage) {
    return NextResponse.json({ error: 'ID, promo code, and discount percentage are required' }, { status: 400 });
  }

  try {
    const updatedPromo = await prisma.promo.update({
      where: { id },
      data: {
        code,
        discountPercentage,
        validFrom: validFrom ? new Date(validFrom) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive,
      },
    });
    return NextResponse.json(updatedPromo);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating promo' }, { status: 500 });
  }
}

// DELETE: Delete a promo
export async function DELETE(request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    await prisma.promo.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Promo deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting promo' }, { status: 500 });
  }
}
