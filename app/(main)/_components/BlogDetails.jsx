'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "./BlogCard";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterest,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa";

const BlogDetails = ({ slug }) => {
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const icons = [
    { component: FaFacebookF, key: "facebook" },
    { component: FaTwitter, key: "twitter" },
    { component: FaPinterest, key: "pinterest" },
    { component: FaLinkedinIn, key: "linkedin" },
    { component: FaTelegram, key: "telegram" },
  ];

  // Fetch blog details and related blogs
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`/api/blog`);
        const data = await response.json();
        const  blog = data.find((blog) => blog.slug === slug && blog.published);
        const filterBlog=data.filter((blog) => blog.slug !== slug && blog.published);

        setBlog(blog); // Assuming your API returns the blog data
        setRelatedBlogs(filterBlog); // Assuming your API returns related blogs
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [slug]);

  console.log(blog);
  console.log(relatedBlogs);

  if (!blog) {
    return <div>Loading...</div>; // Optionally, handle loading state
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Blog content */}
      <div className="bg-white shadow-md border p-6 mb-8">
        {/* Blog title */}
        <h1 className="text-2xl lg:text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        <p>{blog.startContent}</p>

        {/* Blog image */}
        <div className="relative my-3 lg:my-6 flex justify-between flex-col-reverse lg:flex-row">
          <p>{blog.middleContent}</p>
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            width={450}
            height={250}
            className="h-[380px] w-[500px] md:h-[500px] object-fit mx-2 lg:mx-4"
          />
        </div>

        {/* Blog content */}
        <div className="text-gray-700 leading-relaxed space-y-4">
          <p>{blog.endContent}</p>
        </div>
        <div className="flex gap-4 my-4">
          <p className="text-sm md:text-lg font-semibold">Share: </p>
          <ul className="flex text-blue-500 items-center justify-center gap-2 ">
            {icons.map(({ component: Icon, key }) => (
              <li key={key} className="border p-2">
                <Icon className="hover:text-[#cd8c2b] cursor-pointer" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related blogs section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 py-2 border-gray-200">
          Related Blogs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedBlogs.map((relatedBlog) => (
            <BlogCard
              key={relatedBlog.id} // Assuming each related blog has a unique ID
              title={relatedBlog.title}
              image={relatedBlog.imageUrl}
              date={new Date(relatedBlog.createdAt).toLocaleDateString()} // Assuming date is available in related blog
              blogSlug={relatedBlog.slug}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
