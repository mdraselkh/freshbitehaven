import React from 'react'
import AllProducts from '../../_components/AllProducts'


const Page = () => {
  const category='Bakery & Eggs'
  return (
    <div>
        <AllProducts category={category}/>
    </div>
  )
}

export default Page



