import React from 'react';

const ReviewCard = ({ AvatarComponent, userName, reviewMessage }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <div className="flex items-start space-x-4">
      <div className="md:w-20 md:h-20 w-14 h-14">
          <AvatarComponent className='text-5xl'/>
        </div>
        
        <div className="flex-1">
          <h3 className="md:text-lg text-base font-semibold text-gray-800">{userName}</h3>
          
        
          <p className="mt-2 text-gray-600 text-sm">
            &quot;{reviewMessage}&quot;
          </p>
          
          
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
