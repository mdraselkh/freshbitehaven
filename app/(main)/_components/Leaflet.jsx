import React from 'react';
import Image from 'next/image';
import leaflet from '@/public/leaflet.png';

const Leaflet = () => {
  return (
    <div className='container mx-auto px-4 py-4 md:py-10'>
      <div className='max-w-screen-md mx-auto'>
        <Image
          src={leaflet}
          alt='Leaflet'
          layout='responsive'
          width={1200}
          height={800}
          className='rounded-lg shadow-md'
        />
      </div>
    </div>
  );
};

export default Leaflet;
