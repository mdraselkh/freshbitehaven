import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";



export async function GET() {
  const posts = await prisma.blogPost.findMany();
  return NextResponse.json(posts);
}

export async function POST(req) {
  const formData = await req.formData();
  
  // Extract fields from formData
  const title = formData.get("title");
  const slug = formData.get("blogslug");
  const imageFile = formData.get("imageFile"); // Ensure this matches your form input
  const startContent = formData.get("startcontent");
  const middleContent = formData.get("middlecontent");
  const endContent = formData.get("endcontent");
  const published = formData.get("published");

  console.log(formData);


  try {
    // Handle image upload
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imagePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      imageFile.name // Use original filename for the uploaded image
    );

    // Save image to the server
    fs.writeFileSync(imagePath, imageBuffer);

    // Create the blog post in the database
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        imageUrl: `/uploads/${imageFile.name}`, // Store the image URL
        startContent,
        middleContent,
        endContent,
        published: published === "true", // Convert string to boolean
      },
    });
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

