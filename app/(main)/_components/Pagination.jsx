import React from 'react';

const Pagination = ({
  totalPages,
  currentPage,
  paginate,
  itemsPerPage,
  setItemsPerPage
  
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Generate the page numbers to be displayed
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className='mt-10 flex flex-row items-center justify-between border-t border-gray-200 py-3'>
      <div className='max-w-28 h-[38px] mt-4 md:mt-0 flex items-center p-1 bg-gray-300 hover:bg-gray-400 focus:outline-none'>
        <label htmlFor='itemsPerPage' className='block text-xs md:text-sm font-medium text-gray-800 px-1'>
          Show
        </label>
        <select
          id='itemsPerPage'
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(e.target.value)}
          className='w-full h-8 px-2 border border-[#434f17] rounded-md focus:outline-none focus:border-[#434f17] cursor-pointer text-sm md:text-base'
        >

          <option value='8'>8</option>
          <option value='12'>12</option>
          <option value='16'>16</option>
          <option value='20'>20</option>
          <option value='50'>50</option>
        </select>
      </div>
      <div className='flex items-center space-x-2'>
        {/* Previous Button */}
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={isFirstPage}
          className={`px-3 py-1 font-semibold ${
            isFirstPage ? 'bg-gray-300 text-[#434f17]' : 'bg-[#434f17] text-gray-100 '
          } focus:outline-none`}
        >
          &lt;
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((number, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 ${
                currentPage === number ? 'border-[#7d9626] border text-black' : 'border-gray-200 border text-black hover:bg-[#d6e69d]'
              } focus:outline-none`}
            >
              {number}
            </button>
            {/* Add ellipsis if there's a gap */}
            {index < pageNumbers.length - 1 && pageNumbers[index + 1] > number + 1 && (
              <span className='px-3 py-1 text-[#7d9626]'>...</span>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={isLastPage}
          className={`px-3 py-1 font-semibold ${
            isLastPage ? 'bg-gray-300 text-[#434f17]' : 'bg-[#434f17] text-gray-100 '
          } focus:outline-none`}
        >
          &gt;
        </button>
      </div>
      
    </div>
  );
};

export default Pagination;
