"use client";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons for edit and delete
import { toast } from "react-toastify"; // Make sure to install react-toastify for notifications
import TablePagination from "./TablePagination";
import Image from "next/image";

const BlogPosts = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Fetch blog posts data (you might need to adjust the API endpoint)
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog"); // Adjust API endpoint as necessary
        const data = await response.json();
        setBlogPosts(data); // Assuming your API returns an array of blog posts
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogPosts.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);

  const handleEdit = (id) => {
    // Implement edit functionality here
    console.log(`Edit blog post with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      toast.success("Deleted blog post successfully");
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  return (
    <div>
      <div className="max-w-4xl overflow-x-auto mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">SL</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Slug</th>
              <th className="border px-4 py-2">Published</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((post, index) => (
              <tr key={post.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {post.imageUrl && (
                    <Image
                      width={80}
                      height={80}
                      src={post.imageUrl} // Assuming imageUrl is a field in your blog post
                      alt={post.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </td>

                <td className="border px-4 py-2">{post.title}</td>
                <td className="border px-4 py-2">{post.slug}</td>
                <td className="border px-4 py-2">
                  {post.published ? "Yes" : "No"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(post.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default BlogPosts;
