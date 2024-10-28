"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuArrowRightFromLine } from "react-icons/lu";

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);

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

  // Group subcategories by category ID
  const groupedSubcategories = subcategories.reduce((acc, subcategory) => {
    if (!acc[subcategory.categoryId]) {
      acc[subcategory.categoryId] = [];
    }
    acc[subcategory.categoryId].push(subcategory);
    return acc;
  }, {});

  const router = useRouter();

  const handleItemClick = (item1, item2) => {
    const formattedItem1 = item1
      .toLowerCase()
      .replace(/&/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (item2) {
      const formattedItem2 = item2
        .toLowerCase()
        .replace(/&/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      router.push(`/product-category/${formattedItem1}/${formattedItem2}`);
    } else {
      router.push(`/product-category/${formattedItem1}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-10 py-6">
      <h2 className="text-center text-lg md:text-xl lg:text-2xl font-semibold mb-6">
        All Top Categories & Subcategories
      </h2>

      {/* Display Categories and Subcategories */}
      <div className="grid grid-cols-1  gap-6">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col sm:flex-row sm:items-center justify-between">
            {/* Category Card */}
            <button
              className="flex flex-col items-center cursor-pointer p-4 border rounded-lg hover:shadow-lg"
              onClick={() => handleItemClick(category.name)}
            >
              <div className="w-full h-36">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={160}
                  height={144}
                  className="object-fit w-full h-full"
                />
              </div>
              <div className="mt-3">
                <h3 className="text-lg font-bold text-center">{category.name}</h3>
              </div>
            </button>

            {/* Conditionally Render Arrow Icon if Subcategories Exist */}
            {groupedSubcategories[category.id] && groupedSubcategories[category.id].length > 0 && (
              <div className="flex items-center justify-center h-full mt-4 sm:mt-0 sm:ml-4">
                <span className="text-3xl font-bold text-green-800 transform rotate-90 sm:rotate-0">
                  <LuArrowRightFromLine />
                </span>
              </div>
            )}

            {/* Subcategories */}
            {groupedSubcategories[category.id] && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 sm:mt-0">
                {groupedSubcategories[category.id].map((subcard) => (
                  <button
                    key={subcard.id}
                    className="flex flex-col items-center cursor-pointer p-1 border rounded-md hover:shadow-lg"
                    onClick={() => handleItemClick(category.name, subcard.name)}
                  >
                    <div className="w-full h-full sm:w-32 sm:h-32">
                      <Image
                        src={subcard.image}
                        alt={subcard.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-2 w-full text-center">
                      <h4 className="text-sm font-semibold">{subcard.name}</h4>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
