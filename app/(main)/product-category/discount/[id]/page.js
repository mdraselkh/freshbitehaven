import React from 'react';
import ProductDetails from '@/app/(main)/_components/ProductDetails';

const page = ({ params: { id } }) => {
  return (
    <div className='bg-gray-100'>
      <ProductDetails id={id} />
    </div>
  );
};

export default page;
