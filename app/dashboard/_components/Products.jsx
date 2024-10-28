"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import TablePagination from "./TablePagination";
import { useRouter } from "next/navigation";
import { TbShoppingCartDiscount } from "react-icons/tb";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const router = useRouter();

  const handleSetDisProductData = (product) => {
    // console.log(product);
    sessionStorage.setItem("discountProduct", JSON.stringify(product));
    router.push("/dashboard/add-product");
  };

  const handleEdit = (product) => {
    // console.log(product);
    sessionStorage.setItem("editProduct", JSON.stringify(product));
    router.push("/dashboard/add-product");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Failed to fetch products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  console.log(currentItems);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Products List</h1>
      <div className=" overflow-x-auto w-full">
        <table className="w-full bg-white border text-center border-gray-300 text-sm">
          <thead>
            <tr className=" bg-gray-100">
              <th className=" border px-1 py-0" rowSpan={2}>
                SL
              </th>
              <th className=" border px-1 py-0" rowSpan={2}>
                Image
              </th>
              <th className=" border px-1 py-0" rowSpan={2}>
                Category
              </th>
              <th className=" border px-1 py-0" rowSpan={2}>
                SubCategory
              </th>
              <th className=" border px-1 py-0" rowSpan={2}>
                Name
              </th>
              {/* <th className=' border px-1 py-0' rowSpan={2}>
              Local Name
            </th> */}
              <th className=" py-0">
                <table className="w-full">
                  <tbody>
                    <tr>
                      <th colSpan="3">Sizes Info</th>
                    </tr>
                    <tr>
                      <th className="  border-t  w-[70px]">Weight</th>
                      <th className=" border-l border-t   w-[70px]">Price</th>
                      <th className=" border-l border-t   w-[70px]">
                        Discount Price
                      </th>
                    </tr>
                  </tbody>
                </table>
              </th>
              <th className="w-[250px] border px-1 py-0">Description</th>
              <th className="border px-1 py-0">Stock</th>
              <th className="border px-1 py-0">Status</th>
              <th className="border px-1 py-0 w-[120px]">Product Types</th>
              <th className="border px-1 py-0">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product.id} className="border py-0">
                <td className=" border px-1 py-0">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className=" border px-1 py-0">
                  <Image
                    src={product.image}
                    width={100}
                    height={100}
                    alt={product.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="border px-1 py-0">{product.category.name}</td>
                <td className="border px-1 py-0">
                  {product.subcategory
                    ? product.subcategory.name
                    : " No SubCategory"}
                </td>

                <td className=" border px-1 py-0">
                  {product.name}{" "}
                  {product.localName ? `${product.localName}` : ""}
                </td>
                {/* <td className=' border px-1 py-0'></td> */}
                <td className="border py-0 h-10">
                  <table className="w-full h-full">
                    <tbody>
                      {product.sizes.map((size, index) => (
                        <tr key={index} className="">
                          <td className=" border-b  w-[70px]">{size.weight}</td>
                          <td className="border-l border-b  w-[70px]">
                            {size.price}
                          </td>
                          <td className="border-l border-b  w-[70px]">
                            {size.discountPrice && size.discountPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td className="border p-1 py-0 text-xs">
                  {product.description}
                </td>
                <td className="border px-1 py-0 text-[#7d9626] font-semibold">{product.stock}</td>
                <td className="border px-1 py-0 ">
                  <span
                    className={`capitalize font-semibold rounded-md py-1 px-2 text-sm ${
                      product.status === "active"
                        ? "bg-green-100 text-green-500"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td
                  className='border px-1 py-2'
                >
                  <span className="flex flex-col gap-1 items-center justify-center text-sm">
                  <p  className={`font-semibold rounded px-2 ${
                      product.isBestSelling?
                        "bg-teal-100 text-teal-500"
                        : " "
                    }`}>{product.isBestSelling? "Best Selling" : ""}</p>
                  <p  className={`font-semibold rounded px-2 ${
                      product.isFeatured?
                        "bg-yellow-100 text-yellow-500"
                        : " "
                    }`}>{product.isFeatured? "Featured" : ""}</p>
                  <p  className={`font-semibold rounded px-2 ${
                      product.isNewArrival?
                        "bg-blue-100 text-blue-500"
                        : " "
                    }`}>{product.isNewArrival? "New  Arrival" : ""}</p>
                  <p  className={`font-semibold rounded px-2 ${
                      product.isOnOffer?
                        "bg-orange-100 text-orange-500"
                        : " "
                    }`}>{product.isOnOffer? "On Offers" : ""}</p>
                  </span>
                  
                </td>
                <td className="border px-1 py-0">
                  {/* <button
                  className="text-orange-500 hover:text-orange-700"
                  onClick={() => handleSetDisProductData(product)}
                >
                  <TbShoppingCartDiscount className="text-lg"/>
                </button> */}
                  <button
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    onClick={() => handleEdit(product)}
                  >
                    <FaEdit className="text-lg" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TablePagination
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
};

export default Products;
