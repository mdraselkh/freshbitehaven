"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCards from "./ProductCards";

const SearchPage = () => {
  const searchParams = useSearchParams(); // Use Next.js's search params hook
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    console.log(category);

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(
            query
          )}&category=${encodeURIComponent(category)}`
        );
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          setError(data.message || "An error occurred");
        }
      } catch (err) {
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    if (query || category) {
      fetchProducts();
    }
  }, [searchParams]);

  // console.log('products', products);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p>{error}</p>;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="sm:text-3xl text-xl font-semibold text-center mb-8">
          Search Results
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:gap-6 gap-3">
          {currentItems.length > 0 ? (
            currentItems.map((product) => (
              <ProductCards key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center col-span-full border-t-2 border-gray-300 pt-8">
              <span className="text-sm">
                There are no products matching your search.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
