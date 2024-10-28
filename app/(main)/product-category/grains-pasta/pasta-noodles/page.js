import AllProducts from '@/app/(main)/_components/AllProducts';
import React from 'react'



const Page = () => {
  const category='Grains & Pasta';
  const subcategory='Pasta & Noodles';

  return (
    <div>
        <AllProducts category={category} subcategory={subcategory}/>
    </div>
  )
}

export default Page