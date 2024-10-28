'use client';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaUsers, FaDollarSign, FaBoxOpen } from 'react-icons/fa';
import DashboardCard from './DashboardCard';
import { TbCurrencyTaka } from 'react-icons/tb';

const Dashboard = () => {
  const [cardsData, setCardsData] = useState([]);


  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();

        console.log("Dashboard data", data);

        const updatedCardsData = [
          {
            icon: <FaShoppingCart />,
            title: 'Total Orders',
            value: data[0].value, // Adjust based on your API response
            bgColor: 'bg-blue-400',
            iconbgColor: 'bg-blue-600',
            isCurrency: false,
          },
          {
            icon: <FaUsers />,
            title: 'Total Users',
            value: data[1].value, // Adjust based on your API response
            bgColor: 'bg-green-400',
            iconbgColor: 'bg-green-600',
            isCurrency: false,
          },
          {
            icon: <TbCurrencyTaka />,
            title: 'Total Sales',
            value: data[2].value,
            bgColor: 'bg-purple-400',
            iconbgColor: 'bg-purple-600',
            isCurrency: true,
          },
          {
            icon: <FaBoxOpen />,
            title: 'Total Products',
            value: data[3].value, 
            bgColor: 'bg-orange-400',
            iconbgColor: 'bg-orange-600',
            isCurrency: false,
          },
          {
            icon: <FaShoppingCart />,
            title: 'Daily Orders',
            value: data[4].value, 
            bgColor: ' bg-cyan-400',
            iconbgColor: ' bg-cyan-600',
            isCurrency: false,
          },
          {
            icon: <TbCurrencyTaka />,
            title: 'Daily Sales',
            value: data[5].value,
            bgColor: 'bg-red-400',
            iconbgColor: 'bg-red-600',
            isCurrency: true,
          },
        ];

        setCardsData(updatedCardsData);
      } catch (err) {
        console.error('There are some problems to fetch dashbaord data',err.message);
      } 
    };

    fetchCardData();
  }, []);



  return (
    <div className='p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {cardsData.map((card, index) => (
        <DashboardCard
          key={index}
          icon={card.icon}
          title={card.title}
          value={card.value}
          bgColor={card.bgColor}
          iconbgColor={card.iconbgColor}
          isCurrency={card.isCurrency}
        />
      ))}
    </div>
  );
};

export default Dashboard;
