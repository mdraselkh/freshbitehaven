import React from 'react'
import AllProducts from '../../_components/AllProducts'


const Page = () => {
  const category='Dairy Products'
  return (
    <div>
        <AllProducts category={category}/>
    </div>
  )
}

export default Page



