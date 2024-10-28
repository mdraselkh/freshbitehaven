'use client';
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]); // State to hold the blog data

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog'); // Adjust the API endpoint as necessary
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogs(data); // Assuming your API returns an array of blog objects
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs(); // Call the function to fetch blogs when the component mounts
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10">
      <h2 className="text-center text-2xl font-bold py-2 border-b-2 border-[#ffbd59]">
        Read Our All Blogs
      </h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {blogs.map(blog => (
          <BlogCard
            key={blog.id} // Assuming each blog has a unique 'id'
            title={blog.title} // Blog title
            image={blog.imageUrl} // Use default image if not available
            date={new Date(blog.createdAt).toLocaleDateString()} // Format date
            blogSlug={blog.slug} // Blog slug for linking
          />
        ))}
      </div>
    </div>
  );
};

export default AllBlogs;
