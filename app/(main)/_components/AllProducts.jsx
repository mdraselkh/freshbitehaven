"use client";

import { useState, useEffect } from "react";
import FishCards from "./ProductCards";
import Pagination from "./Pagination";
import { useRouter } from "next/navigation";
import ProductCards from "./ProductCards";

const AllProducts = ({ category, subcategory }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allproducts, setAllProducts] = useState([]);
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
        const availableProducts = data.filter(
          (product) => product.status === "active" 
        );
        setAllProducts(availableProducts);
        if (category && subcategory) {
          const filteredData = availableProducts.filter(
            (product) =>
              product.category.name === category &&
              product.subcategory.name === subcategory
          );
          setProducts(filteredData);
        } else {
          const filtered = availableProducts.filter(
            (product) => product.category.name === category
          );

          setProducts(filtered);
        }
      } catch (error) {
        setError("Error fetching products: " + error.message);
      }
    };

    fetchProducts();
  }, [category, subcategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await fetch("/api/subcategories");
      if (!response.ok) {
        throw new Error("Failed to fetch subcategories");
      }
      const data = await response.json();
      setSubCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);
  const router = useRouter();

  const handleItemClick = (item1, item2) => {
    
    if (item1 && item2) {
      const formattedItem1 = item1
      .toLowerCase()
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    const formattedItem2 = item2
      .toLowerCase()
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
      router.push(`/product-category/${formattedItem1}/${formattedItem2}`);
    } else {
      const formattedItem1 = item1
      .toLowerCase()
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
      router.push(`/product-category/${formattedItem1}`);
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
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
    <div>
      <div className="container mx-auto px-3 lg:px-10 py-2 lg:py-5 flex flex-row">
        <div className="hidden lg:flex flex-col items-start justify-start gap-3 p-4 border-2 shadow-lg w-1/4 h-[550px] overflow-y-auto">
          <h2 className=" lg:text-lg xl:text-2xl font-bold ">All Products Category</h2>
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-start gap-2 lg:text-sm xl:text-base"
            >
              <button
                onClick={() => handleItemClick(category.name)}
                className="hover:text-[#ffbd59] text-gray-800 font-medium"
              >
                {category.name}({allproducts.filter(
                  (product) => product.category.name === category.name
                ).length || 0})
              </button>
              {subcategories
                .filter((subcategory) => subcategory.categoryId === category.id)
                .map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() =>
                      handleItemClick(
                        subcategory.category.name,
                        subcategory.name
                      )
                    }
                    className="text-gray-700 hover:text-[#ffbd59] ml-4"
                  >
                    {"— " + subcategory.name}({allproducts.filter(
                      (product) =>
                        product.subcategory?.name === subcategory.name &&
                        product.category.name === category.name
                    ).length || 0})
                  </button>
                ))}
            </div>
          ))}
        </div>
        <div className="w-full lg:w-3/4 lg:px-3 xl:px-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
          <div className="text-base md:text-lg font-semibold">
              {" "}
              Find Results <span className="text-base text-gray-500">({products.length})</span>
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
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-10 xl:gap-8">
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
    </div>
  );
};

export default AllProducts;
