import React from 'react'
import AllProducts from '../../_components/AllProducts'


const Page = () => {
  const category='Vegetables'
  return (
    <div>
        <AllProducts category={category}/>
    </div>
  )
}

export default Page



