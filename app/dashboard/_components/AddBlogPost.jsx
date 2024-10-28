"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddBlogPost = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    blogslug: "",
    imageFile: null, // Initialize as null
    startcontent: "",
    middlecontent: "",
    endcontent: "",
    published: false,
  });

  const handleImageChange = (e) => {
    setBlogData({ ...blogData, imageFile: e.target.files[0] }); // Correctly set the image file
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogData({ ...blogData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !blogData.title ||
      !blogData.blogslug ||
      !blogData.startcontent ||
      !blogData.middlecontent ||
      !blogData.endcontent
    ) {
      toast.warn("Please fill in all fields!");
      return;
    }

    const formData = new FormData();

    // Append form data
    formData.append("title", blogData.title);
    formData.append("blogslug", blogData.blogslug); // Correctly append slug
    formData.append("imageFile", blogData.imageFile); // Use the image file from state
    formData.append("startcontent", blogData.startcontent);
    formData.append("middlecontent", blogData.middlecontent);
    formData.append("endcontent", blogData.endcontent);
    formData.append("published", blogData.published); // Include published status

    // console.log(formData);
    try {
      // Make the API call to submit the blog data
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      // Handle successful submission (e.g., show a success message)
      if (result) {
        toast.success("Blog post submitted successfully!");

        // Optionally reset form data
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting blog post:", error);
      // Show error toast
      toast.error("Error submitting blog post!");
    }
  };

  const resetForm = () => {
    setBlogData({
      title: "",
      blogslug: "",
      imageFile: null,
      startcontent: "",
      middlecontent: "",
      endcontent: "",
      published: false, // Reset published field
    });

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = ""; // Reset the file input
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Blog Title */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-semibold mb-2">
              Blog Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={blogData.title}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Blog Slug */}
          <div className="mb-4">
            <label
              htmlFor="blogslug"
              className="block text-lg font-semibold mb-2"
            >
              Blog Slug
            </label>
            <input
              type="text"
              id="blogslug"
              name="blogslug"
              value={blogData.blogslug}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Enter blog slug"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-lg font-semibold mb-2">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>
        </div>

        {/* Start Content */}
        <div className="mb-4">
          <label
            htmlFor="startcontent"
            className="block text-lg font-semibold mb-2"
          >
            Start Content
          </label>
          <textarea
            id="startcontent"
            name="startcontent"
            value={blogData.startcontent}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter start content"
            rows="4"
            required
          />
        </div>

        {/* Middle Content */}
        <div className="mb-4">
          <label
            htmlFor="middlecontent"
            className="block text-lg font-semibold mb-2"
          >
            Middle Content
          </label>
          <textarea
            id="middlecontent"
            name="middlecontent"
            value={blogData.middlecontent}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter middle content"
            rows="4"
            required
          />
        </div>

        {/* End Content */}
        <div className="mb-4">
          <label
            htmlFor="endcontent"
            className="block text-lg font-semibold mb-2"
          >
            End Content
          </label>
          <textarea
            id="endcontent"
            name="endcontent"
            value={blogData.endcontent}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded-md"
            placeholder="Enter end content"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold text-lg flex items-center">
            <input
              type="checkbox"
              name="published"
              checked={blogData.published}
              onChange={handleInputChange}
              className="form-checkbox h-6 w-6 rounded mr-2"
            />
            Published
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#7d9626] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#5e751d]"
        >
          Submit Blog Post
        </button>
      </form>
    </div>
  );
};

export default AddBlogPost;
