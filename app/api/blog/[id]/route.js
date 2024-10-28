// app/api/blog/[id]/route.js
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  const post = await prisma.blogPost.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  return NextResponse.json(post);
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { title, slug, imageUrl, startContent, middleContent, endContent, published } = await request.json();

  try {
    const updatedPost = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: {
        title,
        slug,
        imageUrl,
        startContent,
        middleContent,
        endContent,
        published,
      },
    });
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.blogPost.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
