import AllProducts from '@/app/(main)/_components/AllProducts';
import React from 'react'



const Page = () => {
  const category='Snacks';
  const subcategory='Savory & Healthy Snakcs';

  return (
    <div>
        <AllProducts category={category} subcategory={subcategory}/>
    </div>
  )
}

export default Page