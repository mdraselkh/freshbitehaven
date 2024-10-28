'use client';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Pagination from './Pagination';
import ProductCards from './ProductCards';

const DiscountProducts = () => {
    const [offerProducts, setOfferProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(12);


    useEffect(() => {
        const fetchProducts = async () => {
          try {
            const res = await fetch(`/api/products`);
    
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
    
            const data = await res.json();
    
            const availableOfferProducts = data.filter(
              (product) => product.status === "active" && product.isOnOffer
            );
    
            setOfferProducts(availableOfferProducts);

          } catch (error) {
            setError("Error fetching products: " + error.message);
          }
        };
    
        fetchProducts();
      }, []);

      const sortedProducts = [...offerProducts].sort((a, b) => {
        const aPrice = a.sizes?.[0]?.price || 0;
        const bPrice = b.sizes?.[0]?.price || 0;
    
        if (sortOrder === "lowToHigh") {
          return aPrice - bPrice;
        } else if (sortOrder === "highToLow") {
          return bPrice - aPrice;
        }
    
        return 0;
      });
    
      const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
    
      const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
          setCurrentPage(pageNumber);
        }
      };

  return (
    <div className='container mx-auto max-w-7xl'>
        <div className="px-5 py-4">
       <Image
                src='/deals_banners.jpg'
                alt='deals_banners'
                width={600}
                height={240}
                className="object-fit w-full h-60"
              
              />
       </div>
       <div className=" px-5 flex flex-col gap-5 ">
          <div className="flex items-center justify-between">
            <div className="text-base md:text-lg font-semibold">
              {" "}
              Find Results <span className="text-base text-gray-500">({offerProducts.length})</span>
            </div>
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-2 border"
              >
                <option value="">Sort by Price</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5 gap-3 lg:gap-4 xl:gap-6">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <ProductCards key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center col-span-full border-t-2 border-gray-300 pt-8">
                <span className="text-sm">No products available</span>
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>

    </div>
  )
}

export default DiscountProducts