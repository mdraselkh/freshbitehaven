import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AddPromoCode = () => {
  const [promoCode, setPromoCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [promoList, setPromoList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromoId, setCurrentPromoId] = useState(null);

  // Get today's date in dd/mm/yyyy format for disabling previous dates
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD format

  const fetchPromos = async () => {
    const response = await fetch("/api/promos");
    const data = await response.json();
    setPromoList(data);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Handle adding or updating promo code
  const handleAddPromo = async (e) => {
    e.preventDefault();

    if (!promoCode.trim() || !discountPercentage) {
      toast.warn("Please enter both promo code and discount percentage");
      return;
    }

    // Check if discount percentage is valid
    const discount = parseFloat(discountPercentage);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast.warn(
        "Please enter a valid discount percentage (between 1 and 100)"
      );
      return;
    }

    // Validate date fields
    if (validFrom && isNaN(new Date(validFrom).getTime())) {
      toast.warn("Please enter a valid Valid From date.");
      return;
    }
    if (validUntil && isNaN(new Date(validUntil).getTime())) {
      toast.warn("Please enter a valid Valid Until date.");
      return;
    }

    try {
      const promoData = {
        code: promoCode,
        discountPercentage: discount,
        validFrom: validFrom ? new Date(validFrom).toISOString() : null,
        validUntil: validUntil ? new Date(validUntil).toISOString() : null,
        isActive,
      };
      console.log(promoData);
      if (isEditing) {
        // Update promo code
        const response = await fetch("/api/promos", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: currentPromoId, ...promoData }),
        });
        if (response.ok) {
          toast.success("Successfully updated promo code");
          fetchPromos();
        }
      } else {
        // Add new promo code
        const response = await fetch("/api/promos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(promoData),
        });
        if (response.ok) {
          toast.success("Successfully added promo code");
          fetchPromos();
        }

        // const newPromo = await response.json();
        // setPromoList([...promoList, newPromo]);
      }
    } catch (error) {
      toast.error("Error while adding/updating promo code: " + error.message);
    }

    // Clear input fields
    setPromoCode("");
    setDiscountPercentage("");
    setValidFrom("");
    setValidUntil("");
    setIsActive(true);
    setIsEditing(false);
    setCurrentPromoId(null);
  };

  // Handle edit promo code
  const handleEdit = (promo) => {
    setPromoCode(promo.code);
    setDiscountPercentage(promo.discountPercentage);
    setValidFrom(
      promo.validFrom
        ? new Date(promo.validFrom).toISOString().split("T")[0]
        : ""
    );
    setValidUntil(
      promo.validUntil
        ? new Date(promo.validUntil).toISOString().split("T")[0]
        : ""
    );
    setIsActive(promo.isActive);
    setIsEditing(true);
    setCurrentPromoId(promo.id);
  };

  // Handle delete promo code
  const handleDelete = async (id) => {
    try {
      await fetch("/api/promos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      toast.success("Successfully deleted promo code");
      fetchPromos();
    } catch (error) {
      alert("Error while deleting promo code: " + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">
        {isEditing ? "Update Promo Code" : "Add Promo Code"}
      </h2>

      {/* Promo Code Form */}
      <form
        className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2"
        onSubmit={handleAddPromo}
      >
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Promo Code"
          className="px-4 py-2 border border-gray-300 flex-1"
          required
        />
        <input
          type="text"
          value={discountPercentage}
          onChange={(e) => setDiscountPercentage(e.target.value)}
          placeholder="Discount (%)"
          className="px-4 py-2 border border-gray-300 flex-1"
          required
        />
        <input
          type="date"
          value={validFrom}
          onChange={(e) => setValidFrom(e.target.value)}
          placeholder="Valid From"
          className="px-4 py-2 border border-gray-300 flex-1"
          min={formattedToday} // Disable previous dates
        />
        <input
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          placeholder="Valid Until"
          className="px-4 py-2 border border-gray-300 flex-1"
          min={formattedToday} // Disable previous dates
        />
        <label className="flex items-center col-span-1 md:col-span-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
            className="mr-2"
          />
          Active
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 font-semibold"
        >
          {isEditing ? "Update Promo" : "Add Promo"}
        </button>
      </form>

      {/* Promo Codes Table */}
      {promoList.length > 0 && (
    <div className="mt-4 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-2">Promo Codes List</h3>
      <div className="w-full">
        <table className="min-w-full bg-white border border-gray-500 text-center">
          <thead>
            <tr>
              <th className="py-2 px-4 border whitespace-nowrap text-sm sm:text-base">Promo Code</th>
              <th className="py-2 px-4 border whitespace-nowrap text-sm sm:text-base">Discount (%)</th>
              <th className="py-2 px-4 border whitespace-nowrap text-sm sm:text-base">Valid From</th>
              <th className="py-2 px-4 border whitespace-nowrap text-sm sm:text-base">Valid Until</th>
              <th className="py-2 px-4 border whitespace-nowrap text-sm sm:text-base">Active</th>
              <th className="py-2 px-4 border whitespace-nowrap text-sm sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoList.map((promo) => (
              <tr key={promo.id}>
                <td className="py-2 px-4 border whitespace-nowrap text-xs sm:text-base">{promo.code}</td>
                <td className="py-2 px-4 border whitespace-nowrap text-xs sm:text-base">
                  {promo.discountPercentage}
                </td>
                <td className="py-2 px-4 border whitespace-nowrap text-xs sm:text-base">
                  {promo.validFrom
                    ? new Date(promo.validFrom).toLocaleDateString("en-GB")
                    : "N/A"}
                </td>
                <td className="py-2 px-4 border whitespace-nowrap text-xs sm:text-base">
                  {promo.validUntil
                    ? new Date(promo.validUntil).toLocaleDateString("en-GB")
                    : "N/A"}
                </td>
                <td className="py-2 px-4 border whitespace-nowrap text-xs sm:text-base">
                  {promo.isActive ? "Yes" : "No"}
                </td>
                <td className="py-2 px-4 h-10 border flex justify-center">
                  <FaEdit
                    className="cursor-pointer text-blue-500"
                    onClick={() => handleEdit(promo)}
                  />
                  <FaTrash
                    className="cursor-pointer text-red-500 ml-2"
                    onClick={() => handleDelete(promo.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
    </div>
  );
};

export default AddPromoCode;
