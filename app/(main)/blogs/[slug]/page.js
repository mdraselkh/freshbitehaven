import React from 'react'
import BlogDetails from '../../_components/BlogDetails';

const page = ({params}) => {
    const { slug } = params;
  return (
    <div className='container mx-auto p-4'>
     <BlogDetails slug={slug}/>
    </div>
  )
}

export default page