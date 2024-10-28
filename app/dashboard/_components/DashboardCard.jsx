
import React from 'react';
import { TbCurrencyTaka } from 'react-icons/tb';

const DashboardCard = ({ icon, title, value, bgColor, iconbgColor, isCurrency }) => {
  return (
    <div className={`flex items-center justify-between p-6 rounded-lg shadow-md ${bgColor} text-white `}>
      <div className={`mr-4 text-2xl ${iconbgColor} p-4 rounded-full`}>
        {icon}
      </div>
      <div>
        <h2 className="text-lg">{title}</h2>
        <p className="text-2xl font-bold flex items-center">
          {isCurrency && <TbCurrencyTaka/>} 
          {value}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
