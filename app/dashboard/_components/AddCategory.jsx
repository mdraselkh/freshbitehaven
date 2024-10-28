'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Ensure you have a toast library for notifications
import TablePagination from './TablePagination';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) formData.append('image', image);

    const method = editingCategory ? 'PUT' : 'POST';
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';

    const response = await fetch(url, {
      method: method,
      body: formData,
    });

    if (response.ok) {
      setName('');
      setDescription('');
      setImage(null);
      document.getElementById('logo-input').value = '';
      toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully.`);
      setEditingCategory(null); // Reset editing category state
      fetchCategories();
    } else {
      console.error(`Failed to ${editingCategory ? 'update' : 'add'} category`);
      toast.warn(`Failed to ${editingCategory ? 'update' : 'add'} category.`);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setDescription(category.description);
    setEditingCategory(category); // Set the category to edit
  };

  const handleDelete = async (id) => {
  
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Category deleted successfully.');
        fetchCategories();
      } else {
        toast.warn('Failed to delete category.');
      }
    
  };

  return (
    <div>
      <h1 className='text-2xl font-bold'>{editingCategory ? 'Edit Category' : 'Add Category'}</h1>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between'
      >
        <div className='md:w-[25%] w-full'>
          <label className='block text-sm font-medium'>Category Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
            required
          />
        </div>
        <div className='md:w-[25%] w-full'>
          <label className='block text-sm font-medium'>Category Image</label>
          <input
            type='file'
            accept='image/*'
            id='logo-input'
            onChange={(e) => setImage(e.target.files[0])}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        <div className='md:w-[30%] w-full'>
          <label className='block text-sm font-medium'>Category Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md p-2'
          />
        </div>
        <button type='submit' className='bg-blue-600 text-white py-2 px-4 rounded-md mt-5 w-full md:w-auto'>
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      <div className='overflow-x-auto'>

      <h2 className='mt-6 text-xl font-bold'>Categories List</h2>
      <table className='min-w-full mt-4 border border-gray-300 text-sm'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='border px-4 py-2'>SL</th>
            <th className='border px-4 py-2'>Image</th>
            <th className='border px-4 py-2'>Name</th>
            <th className='border px-4 py-2'>Description</th>
            <th className='border px-4 py-2'>Actions</th> {/* New actions column */}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category, index) => (
            <tr key={category.id} className='border-b text-center'>
              <td className='border px-4 py-2'>{index +indexOfFirstItem + 1}</td>
              <td className='border px-4 py-1'>
                {category.image && (
                  <Image src={category.image} alt={category.name} width={56} height={56} className='w-14 h-14 object-cover ' />
                )}
              </td>
              <td className='border px-4 py-2'>{category.name}</td>
              <td className='border px-4 py-2'>{category.description}</td>
              <td className='border px-4 py-2'>
                <button
                  onClick={() => handleEdit(category)}
                  className='text-blue-500 hover:text-blue-700  mr-2'
                >
                  <FaEdit/>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <FaTrash/>
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

export default AddCategory;
