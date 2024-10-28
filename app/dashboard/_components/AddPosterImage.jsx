'use client';
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddPosterImage = () => {
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!image) {
      newErrors.image = "At least one image is required.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    if (image) formData.append("image", image);

    try {
      const response = await fetch("/api/posterimg", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success("Data submitted successfully!");
        setImage(null);
        document.getElementById("images-input").value = "";
      } else {
        const errorData = await response.json();
        console.error(errorData);
        toast.warn("Error submitting data.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Poster Images</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            id="images-input"
            onChange={(e) => setImage(e.target.files[0])}
            className={`mt-1 block w-full border ${
              errors.image ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm p-2`}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPosterImage;
