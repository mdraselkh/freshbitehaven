'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddHomeData = () => {
  const [hotline, setHotline] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!hotline) {
      newErrors.hotline = 'Hotline is required.';
    }

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!logo) {
      newErrors.logo = 'Logo is required.';
    }


    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMessage('');
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('hotline', hotline);
    formData.append('email', email);
    formData.append('logo', logo);



    try {
      const response = await fetch('/api/homedata', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success('Data submitted successfully!');
        // Reset the form
        setHotline('');
        setEmail('');
        setLogo(null);


        document.getElementById('logo-input').value = '';

      } else {
        const errorData = await response.json();
        console.error(errorData);
        toast.warn('Error submitting data.');
      }
    } catch (error) {
      console.error('Error:', error);
    //   setMessage('Something went wrong.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Home Data</h1>
      {/* {message && <p className="text-red-500 text-center">{message}</p>} */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hotline<span className='text-red-500'>*</span></label>
          <input
            type="text"
            value={hotline}
            onChange={(e) => setHotline(e.target.value)}
            className={`mt-1 block w-full border ${errors.hotline ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.hotline && <p className="text-red-500 text-sm">{errors.hotline}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email<span className='text-red-500'>*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Logo<span className='text-red-500'>*</span></label>
          <input
            type="file"
            accept="image/*"
            id='logo-input'
            onChange={(e) => setLogo(e.target.files[0])}
            className={`mt-1 block w-full border ${errors.logo ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            required
          />
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
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

export default AddHomeData;
