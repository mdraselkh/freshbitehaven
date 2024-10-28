"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoBagAddOutline } from "react-icons/io5";
import {
  MdOutlineAddCircleOutline,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import { toast } from "react-toastify";
import { GrPowerReset } from "react-icons/gr";
import Image from "next/image";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [editProduct, setEditProduct] = useState(false);
  const [productLocalName, setProductLocalName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState([
    { weight: "", price: "", discountPrice: "" },
  ]);
  const [image, setImage] = useState(null);
  const [stock, setStock] = useState(0); // New stock field
  const [status, setStatus] = useState("active"); // New status field
  const [isBestSelling, setIsBestSelling] = useState(false); // New flags
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isOnOffer, setIsOnOffer] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productId, setProductId] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await fetch("/api/subcategories");
      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();

      const filteredSubcategories = data.filter(
        (subcat) => subcat.categoryId === categoryId
      );

      setSubcategories(filteredSubcategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find((cat) => cat.name === category);
      if (selectedCategory) {
        fetchSubcategories(selectedCategory.id);

        // Handle product editing
        if (editProduct) {
          const parsedEditProduct = JSON.parse(
            sessionStorage.getItem("editProduct")
          );

          if (parsedEditProduct?.subcategory) {
            setSubcategory(parsedEditProduct.subcategory.name);
          }
        }
      }
    }
  }, [category, categories, editProduct]);

  useEffect(() => {
    const editProduct = sessionStorage.getItem("editProduct");

    if (editProduct) {
      const parsedEditProduct = editProduct ? JSON.parse(editProduct) : null;
      setProductId(parsedEditProduct.id);
      setProductName(parsedEditProduct.name);
      setProductLocalName(parsedEditProduct.localName);
      setCategory(parsedEditProduct.category.name);
      // setSubcategory(parsedEditProduct.subcategory.name);
      setSizes(
        Array.isArray(parsedEditProduct.sizes)
          ? parsedEditProduct.sizes.map((size) => ({
              weight: size.weight || "",
              price: size.price || "",
              discountPrice: size.discountPrice || "",
            }))
          : []
      );
      setDescription(parsedEditProduct.description);
      if (parsedEditProduct.image) {
        setImage(null);
      }
      setStock(parsedEditProduct.stock || 0);
      setStatus(parsedEditProduct.status || "active");
      setIsBestSelling(parsedEditProduct.isBestSelling || false);
      setIsFeatured(parsedEditProduct.isFeatured || false);
      setIsNewArrival(parsedEditProduct.isNewArrival || false);
      setIsOnOffer(parsedEditProduct.isOnOffer || false);
      setEditProduct(true);
    }

    sessionStorage.removeItem("editProduct");
  }, []);

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    setSizes(updatedSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { weight: "", price: "", discountPrice: "" }]);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName) {
      toast.warn("Please enter product name.");
      return;
    }

    if (!category) {
      toast.warn("Please choose any category.");
      return;
    }
    const selectedSubcategory = subcategories.length === 0 ? null : subCategory;

    if (subcategories.length > 0 && !selectedSubcategory) {
      toast.warn("Subcategory is required.");
      return;
    }

    const hasValidSize = sizes.some((size) => {
      const weightValid = String(size.weight).trim() !== "";
      const priceValid = String(size.price).trim() !== "";
      const discountPriceValid =
        String(size.discountPrice).trim() !== "" &&
        !isNaN(Number(size.discountPrice));

      return (weightValid && priceValid) || discountPriceValid;
    });

    if (!hasValidSize) {
      toast.warn(
        "Please add at least one valid size with weight, price, and discount price."
      );
      return;
    }

    if (!image) {
      toast.warn("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("localName", productLocalName);
    formData.append("category", category);
    formData.append("subcategory", selectedSubcategory);
    formData.append("description", description);
    formData.append("image", image);
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("stock", stock); // Add stock to form data
    formData.append("status", status); // Add status to form data
    formData.append("isBestSelling", isBestSelling); // Add product type flags
    formData.append("isFeatured", isFeatured);
    formData.append("isNewArrival", isNewArrival);
    formData.append("isOnOffer", isOnOffer);

    if (productId) {
      formData.append("productId", productId.toString());
    }

    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    const method = productId ? "PUT" : "POST";

    try {
      const response = await fetch("/api/products", {
        method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (productId) {
          toast.success("Product updated successfully!");
        } else {
          toast.success("Product created successfully!");
        }
        resetForm();
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product created failed!");
    }
  };

  const resetForm = () => {
    setProductId(null);
    setProductName("");
    setProductLocalName("");
    setCategory("");
    setSubcategory("");
    setDescription("");
    setImage(null);
    setSizes([{ weight: "", price: "", discountPrice: "" }]);
    setShowDiscount(false);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
    setStock(0);
    setStatus("active");
    setIsBestSelling(false);
    setIsFeatured(false);
    setIsNewArrival(false);
    setIsOnOffer(false);
    sessionStorage.removeItem("editProduct");
  };

  const removeSizeField = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };

  return (
    <div className="container mx-auto p-5">
      <form
        id="add-product-form"
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col md:flex-row items-center justify-between gap-8"
      >
        <div className="w-full">
          <h1 className="text-lg md:text-xl font-semibold pb-4">
            {editProduct ? "Update Product" : "Add Product"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="font-semibold">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                name="productName"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="px-3 py-2 w-full border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Local Name</label>
              <input
                name="productLocalName"
                placeholder="Enter local name"
                value={productLocalName}
                onChange={(e) => setProductLocalName(e.target.value)}
                className="px-3 py-2 w-full border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">
                Category<span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                // onChange={(e) => {
                //   setCategory(e.target.value);
                // }}
                className="px-3 py-2 border rounded-md bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">
                subCategory<span className="text-red-500">*</span>
              </label>
              <select
                name="subCategory"
                value={subCategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="px-3 py-2 w-full border rounded-md"
              >
                <option value="">Select a subCategory</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.name}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Enter description"
                value={description}
                rows={5}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 border rounded-md"
              />
            </div>

            <div className="h-40 overflow-auto flex flex-col relative">
              <div className="flex flex-row flex-wrap gap-3">
                {sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex flex-col">
                      <label className="font-semibold">Weight</label>
                      <input
                        name={`weight-${index}`}
                        placeholder="Weight"
                        value={size.weight}
                        onChange={(e) =>
                          handleSizeChange(index, "weight", e.target.value)
                        }
                        className="px-3 py-2 w-full border rounded-md"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="font-semibold">Price</label>
                      <input
                        name={`price-${index}`}
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) =>
                          handleSizeChange(index, "price", e.target.value)
                        }
                        className="px-3 py-2 w-full border rounded-md"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold">D Price</label>
                      <input
                        name={`discountPrice-${index}`}
                        placeholder="D... Price"
                        value={size.discountPrice}
                        onChange={(e) =>
                          handleSizeChange(
                            index,
                            "discountPrice",
                            e.target.value
                          )
                        }
                        className="px-3 py-2 w-full border rounded-md"
                      />
                    </div>

                    {/* Add a remove button next to each row */}
                    <button
                      onClick={() => removeSizeField(index)}
                      className={`mt-5 ${
                        sizes.length === 1
                          ? ""
                          : "text-red-600 hover:text-red-800"
                      }`}
                      disabled={sizes.length === 1}
                    >
                      <MdOutlineRemoveCircleOutline className="text-2xl" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSizeField}
                className="absolute top-0 right-0 text-blue-600 hover:text-blue-800"
              >
                <MdOutlineAddCircleOutline className="text-2xl" />
              </button>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">
                Upload Image<span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                className="px-3 py-1 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="font-semibold">Stock</label>
                <input
                  name="stock"
                  placeholder="Enter stock quantity"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Status</label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="active">Active</option>
                  <option value="deactivated">Deactivated</option>
                </select>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 items-center mt-6">
            <label className="font-semibold text-lg flex items-center">
              <input
                type="checkbox"
                checked={isBestSelling}
                onChange={(e) => setIsBestSelling(e.target.checked)}
                className="form-checkbox h-6 w-6 rounded mr-2"
              />
              Best Selling
            </label>
            <label  className="font-semibold text-lg flex items-center">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="form-checkbox h-6 w-6 rounded mr-2"
              />
              Featured
            </label>
            <label  className="font-semibold text-lg flex items-center">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="form-checkbox h-6 w-6 rounded mr-2"
              />
              New Arrival
            </label>
            <label  className="font-semibold text-lg flex items-center">
              <input
                type="checkbox"
                checked={isOnOffer}
                onChange={(e) => setIsOnOffer(e.target.checked)}
                className="form-checkbox h-6 w-6 rounded mr-2"
              />
              On Offer
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#7d9626] border-2 hover:bg-gray-50 text-white hover:text-black font-semibold rounded-lg mt-6  px-2 py-3 flex items-center justify-center gap-2" // added 'flex' here
            >
              <span className="flex items-center gap-2">
                <IoBagAddOutline />
                {editProduct ? "Update Product" : "Add Product"}
              </span>
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-red-500 border-2 hover:bg-gray-50 text-white hover:text-black font-semibold rounded-lg mt-6  px-2 py-3 flex items-center justify-center gap-2"
            >
              <span className="flex items-center gap-2">
                <GrPowerReset />
                Reset
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
