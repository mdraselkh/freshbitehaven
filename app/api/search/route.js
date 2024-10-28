import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('category') || '';

  try {
    // Log the incoming category and query for debugging
    console.log('Incoming Category:', category);
    console.log('Incoming Query:', query);
    console.log('Incoming Subcategory:', subcategory);

    // Find category based on name with case-insensitive search
    const categoryData = category ? await prisma.category.findFirst({
      where: {
        name: {
          equals: category,
          mode: 'insensitive',  // Case-insensitive matching
        },
      },
    }) : null;

    // Log the category data to verify the match
    console.log('Fetched Category Data:', categoryData);

    const subcategoryData = subcategory ? await prisma.subCategory.findFirst({
      where: {
        name: {
          equals: subcategory,
          mode: 'insensitive',  // Case-insensitive matching
        },
      },
    }) : null;

    const categoryId = categoryData ? categoryData.id : undefined;
    const subcategoryId = subcategoryData ? subcategoryData.id : undefined;

    let products;

    // Build the where clause dynamically
    const whereClause = {
      AND: [],
    };

    if (query) {
      whereClause.AND.push({
        name: {
          contains: query,
          mode: 'insensitive',  // Case-insensitive search
        },
      });
    }

    if (categoryId) {
      whereClause.AND.push({
        categoryId: categoryId,
      });
    }

    if (subcategoryId) {
      whereClause.AND.push({
        subcategoryId: subcategoryId,
      });
    }

    // If no search parameters were provided, return all products
    if (whereClause.AND.length === 0) {
      products = await prisma.products.findMany({
        include: {
          sizes: true,
          category: {
            select: {
              name: true,
            },
          },
          subcategory: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      products = await prisma.products.findMany({
        where: whereClause,
        include: {
          sizes: true,
          category: {
            select: {
              name: true,
            },
          },
          subcategory: {
            select: {
              name: true,
            },
          },
        },
      });
    }

    // Log the fetched products to ensure the response is correct
    console.log('Fetched Products:', products);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error Fetching Products:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}