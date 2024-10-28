import React from 'react'
import AllProducts from '../../_components/AllProducts'


const Page = () => {
  const category='Cooking Ingredients';
  return (
    <div>
        <AllProducts category={category}/>
    </div>
  )
}

export default Page



