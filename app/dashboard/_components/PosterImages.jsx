"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";

const PosterImages = () => {
  const [posterImages, setPosterImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingImage, setEditingImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  useEffect(() => {
    const fetchPosterImages = async () => {
      try {
        const response = await fetch("/api/posterimg");
        if (!response.ok) {
          throw new Error("Failed to fetch poster images");
        }
        const data = await response.json();
        setPosterImages(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosterImages();
  }, []);

  const handleEditClick = (image) => {
    setEditingImage(image);
    setNewImageFile(null); // Clear file input when editing a new image
  };

  const handleUpdate = async () => {
    if (!editingImage || !newImageFile) {
      alert("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", newImageFile); // Append the selected file

    try {
      const response = await fetch(`/api/posterimg/${editingImage.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to update the poster image");
      }

      const data = await response.json();
      setPosterImages((prev) =>
        prev.map((image) => (image.id === data.id ? data : image))
      );
      toast.success('Updated Poster Image Succesfully');
      setEditingImage(null);
      setNewImageFile(null); // Clear the file input
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/posterimg/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the poster image");
      }

      setPosterImages((prev) => prev.filter((image) => image.id !== id));
      toast.success('Deleted Poster Image Succesfully');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-300 divide-y divide-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider border border-gray-300">
              ID
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider border border-gray-300">
              Images
            </th>
            <th className="px-4 py-2 text-xs font-medium text-gray-600 uppercase tracking-wider border border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posterImages.map((image) => (
            <tr key={image.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                {image.id}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 border border-gray-300 flex justify-center items-center">
                <Image
                  src={image.images}
                  alt={`Poster ${image.id}`}
                  width={128}
                  height={64}
                  className="object-cover rounded"
                />
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 border border-gray-300">
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() => handleEditClick(image)}
                >
                  <BiEdit size={20} />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 ml-2"
                  onClick={() => handleDelete(image.id)}
                >
                  <MdDeleteForever size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <h2 className="text-lg font-bold mb-2">Edit Image</h2>
            <input
              type="file"
              accept="image/*" // Optional: restrict to image files
              onChange={(e) => setNewImageFile(e.target.files[0])} // Store the selected file
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={handleUpdate} // Ensure this function handles the file upload
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
            <button
              onClick={() => {
                setEditingImage(null);
                setNewImageFile(null); // Clear the file input
              }}
              className="bg-red-600 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterImages;
