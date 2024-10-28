'use client';
import React, { useState, useEffect } from 'react';
import { IoBagAddOutline, IoPencil, IoTrash } from 'react-icons/io5';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const AddShippingCost = () => {
  const [city, setCity] = useState('');
  const [cost, setCost] = useState('');
  const [errors, setErrors] = useState({});
  // const [success, setSuccess] = useState(null);
  const [shippingCosts, setShippingCosts] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const fetchShippingCosts = async () => {
      try {
        const response = await fetch('/api/shipping-costs');
        if (response.ok) {
          const data = await response.json();
          setShippingCosts(data);
        } else {
          setErrors({ ...errors, fetch: 'Failed to load shipping costs.' });
        }
      } catch (err) {
        setErrors({ ...errors, fetch: 'An unexpected error occurred.' });
        console.error('Error fetching shipping costs:', err);
      }
    };

    fetchShippingCosts();
  }, [errors]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};
  
    if (!city) {
      validationErrors.city = 'City is required.';
    }
    if (!cost || parseFloat(cost) <= 0) {
      validationErrors.cost = 'Cost must be a positive number.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const method = editId ? 'PUT' : 'POST';
      const response = await fetch(`/api/shipping-costs${editId ? `/${editId}` : ''}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, cost: parseFloat(cost) }),
      });

      if (response.ok) {
        const result = await response.json();
        if (editId) {
          setShippingCosts(prev =>
            prev.map(item => (item.id === result.id ? result : item))
          );
          toast.success(`Shipping cost updated successfully for ${result.city}.`);
        } else {
          setShippingCosts(prev => [...prev, result]);
          toast.success(`Shipping cost added successfully for ${result.city}.`);
        }
        setCity('');
        setCost('');
        setEditId(null);
      } else {
        const errorData = await response.json();
        setErrors({ ...errors, api: errorData.error || `Failed to ${editId ? 'update' : 'add'} shipping cost.` });
      }
    } catch (err) {
      setErrors({ ...errors, api: `An unexpected error occurred while ${editId ? 'updating' : 'adding'} shipping cost.` });
      toast.error(`Error ${editId ? 'updating' : 'adding'} shipping cost`);
      console.error(`Error ${editId ? 'updating' : 'adding'} shipping cost:`, err);
    }
  };

  const handleEdit = (item) => {
    setCity(item.city);
    setCost(item.cost);
    setEditId(item.id);
  };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`/api/shipping-costs/${id}`, {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         setShippingCosts(prev => prev.filter(item => item.id !== id));
//         toast.success('Shipping cost deleted successfully.');
//       } else {
//         const errorData = await response.json();
//         setErrors({ ...errors, api: errorData.error || 'Failed to delete shipping cost.' });
//       }
//     } catch (err) {
//       setErrors({ ...errors, api: 'An unexpected error occurred while deleting shipping cost.' });
//       toast.error('Error deleting shipping cost');
//       console.error('Error deleting shipping cost:', err);
//     }
//   };

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-xl font-bold mb-4'>Add Shipping Cost</h2>
      <form onSubmit={handleSubmit} className='space-y-4 w-full lg:w-1/2'>
        <div>
          <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
            City
          </label>
          <select
            id='city'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          >
            <option value='' disabled>Select city</option>
            <option value='Inside Dhaka'>Inside Dhaka</option>
            <option value='Outside Dhaka'>Outside Dhaka</option>
          </select>
          {errors.city && <p className='text-red-500 text-xs'>{errors.city}</p>}
        </div>
        <div>
          <label htmlFor='cost' className='block text-sm font-medium text-gray-700'>
            Cost
          </label>
          <input
            id='cost'
            type='number'
            step='0.5'
            min='0'
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
            placeholder='Enter cost'
          />
          {errors.cost && <p className='text-red-500 text-xs'>{errors.cost}</p>}
        </div>
        {errors.api && <p className='text-red-500 text-xs'>{errors.api}</p>}
        <button
          type='submit'
          className='bg-blue-700 border-2 hover:bg-gray-50 text-white hover:text-black font-semibold rounded-lg mt-6 px-2 py-3 flex items-center justify-center gap-2'
        >
          <span className='flex items-center gap-2'>
            <IoBagAddOutline />
            {editId ? 'Update Shipping Cost' : 'Add Shipping Cost'}
          </span>
        </button>
      </form>

      <div className='mt-8'>
        <h3 className='text-lg font-bold mb-4'>Shipping Costs</h3>
        <table className='min-w-full bg-white border text-center'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='py-2 px-4 border'>City</th>
              <th className='py-2 px-4 border'>Cost</th>
              <th className='py-2 px-4 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shippingCosts.length > 0 ? (
              shippingCosts.map((item) => (
                <tr key={item.id}>
                  <td className='py-2 px-4 border'>{item.city}</td>
                  <td className='py-2 px-4 border'>{item.cost.toFixed(2)}</td>
                  <td className='py-2 px-4 border'>
                    <button
                      onClick={() => handleEdit(item)}
                      className='text-blue-500 hover:underline mr-2 p-2 rounded bg-gray-100'
                    >
                      <IoPencil />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(item.id)}
                      className='text-red-500 hover:underline p-2 rounded bg-gray-100'
                    >
                      <IoTrash />
                    </button> */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='3' className='py-2 px-4 border text-center'>No shipping costs available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddShippingCost;
