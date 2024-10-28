// components/Card.js
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Cards = ({ image, title }) => {
  const router = useRouter();

  const handleItemClick = (item) => {
    const formattedItem = item.toLowerCase().replace(/&/g, '-').replace(/\s+/g, '-').replace(/-+/g, '-').trim();

    router.push(`/product-category/${formattedItem}`);
  };

  return (
    <button
      className='border bg-white rounded-lg overflow-hidden shadow-md flex flex-col items-center justify-center transform transition w-44 h-44 md:h-52 duration-300 hover:scale-105'
      onClick={() => handleItemClick(title)}
    >
      <div className=' w-full '>
        <Image
          src={image}
          alt={title}
          width={500} 
          height={300} 
          className='object-cover md:object-contain w-full h-32 sm:h-48 md:h-36 '
        />
      </div>
      <div className=' border-t-2 p-2 w-full'>
        <h3 className=' text-sm sm:text-base font-bold'>{title}</h3>
      </div>
    </button>
  );
};

export default Cards;
