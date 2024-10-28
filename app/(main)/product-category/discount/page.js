import React from 'react'
import AllProducts from '../../_components/AllProducts'


const Page = () => {
  const category='Discount'
  return (
    <div>
        <AllProducts category={category}/>
    </div>
  )
}

export default Page