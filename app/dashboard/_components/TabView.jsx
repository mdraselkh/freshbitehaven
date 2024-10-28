'use client';
import React, { useState } from 'react';
import AddHomeData from './AddHomeData';
import AddContactData from './AddContactData';
import AddPosterImage from './AddPosterImage';
import AddPopupImage from './AddPopupImage';
import AddPromoCode from './AddPromoCode';


const TabView = () => {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <div className='max-w-[700px] mx-auto p-4 mt-4 bg-white shadow-lg rounded-lg'>
      <div className="flex  border-gray-300 mb-4 justify-evenly">
        <button
          className={`w-[20%] p-1 md:py-2 md:px-3 font-semibold transition-colors duration-200 text-sm md:text-base border-2  border-blue-500 ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('home')}
        >
          Add Home Data
        </button>
        <button
          className={`w-[20%] p-1 md:py-2 md:px-3 font-semibold transition-colors duration-200 text-sm md:text-base  border-2  border-blue-500 ${activeTab === 'poster' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('poster')}
        >
          Add Poster Images
        </button>
        <button
          className={`w-[20%] p-1 md:py-2 md:px-3 font-semibold transition-colors duration-200 text-sm md:text-base  border-2  border-blue-500 ${activeTab === 'popup' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('popup')}
        >
          Add PopUp Images
        </button>
        <button
          className={`w-[20%] p-1 md:py-2 md:px-3 font-semibold transition-colors duration-200 text-sm md:text-base  border-2 border-blue-500 ${activeTab === 'footer' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('footer')}
        >
          Add Contact Data
        </button>
        <button
          className={`w-[20%] p-1 md:py-2 md:px-3 font-semibold transition-colors duration-200 text-sm md:text-base  border-2 border-blue-500 ${activeTab === 'promoCode' ? 'bg-blue-600 text-white' : 'text-gray-800 hover:bg-gray-200'}`}
          onClick={() => setActiveTab('promoCode')}
        >
          Add Promo Code
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'home' && <AddHomeData />}
        {activeTab === 'poster' && <AddPosterImage />}
        {activeTab === 'popup' && <AddPopupImage />}
        {activeTab === 'footer' && <AddContactData />}
        {activeTab === 'promoCode' && <AddPromoCode />}
      </div>
    </div>
  );
};

export default TabView;
