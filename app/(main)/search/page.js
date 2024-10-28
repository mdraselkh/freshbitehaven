import React, { Suspense } from 'react';
import SearchPage from '../_components/SearchPage';

const Page = ({ params }) => {
  return (
    <div>
      <Suspense fallback={<div className='text-center'>Loading...</div>}>
        <SearchPage searchParams={params} />
      </Suspense>
    </div>
  );
};

export default Page;
