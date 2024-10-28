'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AddContactData = () => {
  const [hotline, setHotline] = useState('');
  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState(null);
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [locationSrc, setLocationSrc] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!hotline) newErrors.hotline = 'Hotline is required.';
    if (!title) newErrors.title = 'Title is required.';
    if (!logo) newErrors.logo = 'Logo is required.';
    if (!address) newErrors.address = 'Address is required.';
    if (!whatsapp) newErrors.whatsapp = 'WhatsApp number is required.';

    if (!website) newErrors.website = 'Website is required.';
    if (!locationSrc) newErrors.locationSrc = 'Location Source is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('hotline', hotline);
    formData.append('title', title);
    formData.append('logo', logo);
    formData.append('address', address);
    formData.append('whatsapp', whatsapp);
    formData.append('website', website);
    formData.append('email', email);
    formData.append('branchName', branchName);
    formData.append('branchAddress', branchAddress);
    formData.append('locationSrc', locationSrc);

    try {
      const response = await fetch('/api/footerdata', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success('Footer data submitted successfully!');
        // Reset the form
        setHotline('');
        setTitle('');
        setLogo(null);
        setAddress('');
        setWhatsapp('');
        setWebsite('');
        setEmail('');
        setBranchName('');
        setBranchAddress('');
        setLocationSrc('');
        document.getElementById('logo-input').value = '';
      } else {
        const errorData = await response.json();
        console.error(errorData);
        toast.warn('Error submitting data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg mt-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>Add All Contact Data</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex-col flex md:flex-row items-start gap-2 justify-between'>
          {/* Hotline Field */}
          <div className='w-full md:w-auto'>
            <label className='block text-sm font-medium text-gray-700'>
              Hotline<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.hotline ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
              required
            />
            {errors.hotline && <p className='text-red-500 text-sm'>{errors.hotline}</p>}
          </div>

          {/* Title Field */}
          <div className='w-full md:w-auto'>
            <label className='block text-sm font-medium text-gray-700'>
              Title<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
              required
            />
            {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}
          </div>
        </div>

        {/* Logo Field */}
        <div className='w-full md:w-auto'>
          <label className='block text-sm font-medium text-gray-700'>
            Logo<span className='text-red-500'>*</span>
          </label>
          <input
            type='file'
            accept='image/*'
            id='logo-input'
            onChange={(e) => setLogo(e.target.files[0])}
            className={`mt-1 block w-full border ${
              errors.logo ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
            required
          />
          {errors.logo && <p className='text-red-500 text-sm'>{errors.logo}</p>}
        </div>

        <div className='flex-col flex md:flex-row items-start gap-2 justify-between'>
          {/* Address Field */}
          <div className='w-full md:w-auto'>
            <label className='block text-sm font-medium text-gray-700'>
              Address<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
              required
            />
            {errors.address && <p className='text-red-500 text-sm'>{errors.address}</p>}
          </div>
          {/* WhatsApp Field */}
          <div className='w-full md:w-auto'>
            <label className='block text-sm font-medium text-gray-700'>
              WhatsApp<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className={`mt-1 block w-full border ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm p-2`}
              required
            />
            {errors.whatsapp && <p className='text-red-500 text-sm'>{errors.whatsapp}</p>}
          </div>
        </div>

        <div className='flex-col flex md:flex-row items-start gap-2 justify-between'>
        {/* Website Field */}
        <div className='w-full md:w-auto'>
          <label className='block text-sm font-medium text-gray-700'>
            Website<span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className={`mt-1 block w-full border ${
              errors.website ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
          />
          {errors.website && <p className='text-red-500 text-sm'>{errors.website}</p>}
        </div>

        {/* Email Field */}
        <div className='w-full md:w-auto'>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
          />
          {/* {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} */}
        </div>
        </div>

        <div className='flex-col flex md:flex-row items-start gap-2 justify-between'>

       
        {/* Branch Name Field */}
        <div className='w-full md:w-auto'>
          <label className='block text-sm font-medium text-gray-700'>Branch Name</label>
          <input
            type='text'
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className={`mt-1 block w-full border ${
              errors.branchName ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
          />
        </div>

        {/* Branch Address Field */}
        <div className='w-full md:w-auto'>
          <label className='block text-sm font-medium text-gray-700'>Branch Address</label>
          <input
            type='text'
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
            className={`mt-1 block w-full border ${
              errors.branchAddress ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
          />
        </div>
        </div>


        {/* Location Source Field */}
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Location Source<span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            value={locationSrc}
            onChange={(e) => setLocationSrc(e.target.value)}
            className={`mt-1 block w-full border ${
              errors.locationSrc ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm p-2`}
          />
          {errors.locationSrc && <p className='text-red-500 text-sm'>{errors.locationSrc}</p>}
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddContactData;
