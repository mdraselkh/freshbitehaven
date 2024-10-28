"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from 'react-icons/fa';
import TablePagination from "./TablePagination";

const AddSubCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubCategories] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentSubCategory, setCurrentSubCategory] = useState(null);
  const [errors, setErrors] = useState({}); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategories");
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching subcategories.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subcategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(subcategories.length / itemsPerPage);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Subcategory name is required.";
    }
    if (!categoryId) {
      newErrors.categoryId = "Category selection is required.";
    }
    // Add image validation if needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the form
    if (!validateForm()) {
      setLoading(false);
      return; // Stop if validation fails
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);
    if (categoryId) formData.append("categoryId", categoryId);

    try {
      let response;
      if (editMode) {
        response = await fetch(`/api/subcategories/${currentSubCategory.id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        response = await fetch("/api/subcategories", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        setName("");
        setImage(null);
        setCategoryId(null);
        document.getElementById("subcategory-image-input").value = "";
        toast.success(editMode ? "Subcategory updated successfully!" : "Subcategory added successfully!");
        fetchSubCategories();
        setEditMode(false);
        setCurrentSubCategory(null);
      } else {
        throw new Error("Failed to add/update subcategory.");
      }
    } catch (error) {
      console.error(error);
      toast.warn(error.message);
    }
    setLoading(false);
  };

  const handleEdit = (subcategory) => {
    setEditMode(true);
    setCurrentSubCategory(subcategory);
    setName(subcategory.name);
    setCategoryId(subcategory.categoryId);
  };

  const handleDelete = async (id) => {
    
      try {
        const response = await fetch(`/api/subcategories/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Subcategory deleted successfully!");
          fetchSubCategories(); // Refresh the list
        } else {
          throw new Error("Failed to delete subcategory.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Add Subcategory</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between"
      >
        <div className="md:w-[25%] w-full">
          <label className="block text-sm font-medium">Subcategory Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors({ ...errors, name: null }); // Clear error
            }}
            className={`mt-1 block w-full border rounded-md p-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="md:w-[25%] w-full">
          <label className="block text-sm font-medium">Subcategory Image</label>
          <input
            type="file"
            accept="image/*"
            id="subcategory-image-input"
            onChange={(e) => {
              setImage(e.target.files[0]);
              if (errors.image) setErrors({ ...errors, image: null }); // Clear error
            }}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {/* Image error message can be added here if required */}
        </div>
        <div className="md:w-[20%] w-full">
          <label className="block text-sm font-medium">Select Category</label>
          <select
            value={categoryId || ""}
            onChange={(e) => {
              setCategoryId(e.target.value ? parseInt(e.target.value) : null);
              if (errors.categoryId) setErrors({ ...errors, categoryId: null }); // Clear error
            }}
            className={`mt-1 block w-full border rounded-md p-2 ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId}</p>}
        </div>
        <button
          type="submit"
          className={`bg-blue-600 text-white py-2 px-4 rounded-md mt-5 w-full md:w-auto ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Adding..." : editMode ? "Update Subcategory" : "Add Subcategory"}
        </button>
      </form>
      <div className="overflow-x-auto">

      <h2 className="mt-6 text-xl font-bold">SubCategories List</h2>
      <table className="min-w-full mt-4 border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">SL</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((subcategory, index) => (
            <tr key={subcategory.id} className="border-b text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-1">
                {subcategory.image && (
                  <Image
                    src={subcategory.image}
                    alt={subcategory.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-cover"
                  />
                )}
              </td>
              <td className="border px-4 py-2">{subcategory.name}</td>
              <td className="border px-4 py-2">{subcategory.category.name}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(subcategory)}
                  className="text-blue-500 hover:text-blue-700  mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(subcategory.id)}
                  className="text-red-500 hover:text-red-700 "
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

export default AddSubCategory;
