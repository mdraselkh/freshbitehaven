import AllProducts from '@/app/(main)/_components/AllProducts';
import React from 'react'



const Page = () => {
  const category='SeaFood';
  const subcategory='Shellfish';
  return (
    <div>
        <AllProducts category={category} subcategory={subcategory}/>
    </div>
  )
}

export default Page