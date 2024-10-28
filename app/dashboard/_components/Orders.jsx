"use client";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker"; // Make sure to import DatePicker
import TablePagination from "./TablePagination";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      setError("Failed to fetch orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    return orderDate.toDateString() === selectedDate.toDateString();
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePrevDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const statusOptions = [
    { value: 0, name: "Pending" },
    { value: 1, name: "Delivered" },
    { value: 2, name: "Returned" },
    { value: 3, name: "Canceled" },
  ];

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingStatus(true);
    try {
      const response = await fetch(`/api/order/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const updatedOrder = await response.json();
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Orders List</h1>
      <div className="max-w-48 mx-auto">
        <div className="ml-0.5 flex justify-between items-center">
          <p className="font-semibold text-[15px]">Date</p>
          <div className="py-1 flex gap-6">
            <button onClick={handlePrevDay}>
              {/* disabled={filteredOrders.length === 0} */}
              <FaChevronLeft className="text-green-600" />
            </button>
            <button onClick={handleNextDay} disabled={isToday(selectedDate)}>
              <FaChevronRight
                className={`${
                  isToday(selectedDate) ? "text-gray-400" : "text-green-600"
                }`}
              />
            </button>
          </div>
        </div>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          maxDate={new Date()}
          placeholderText="Select date"
          dateFormat="yyyy-MM-dd"
          className="w-32 md:w-48 cursor-pointer p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="table-auto min-w-full bg-white border border-gray-900 text-center text-xs">
          <thead>
            <tr className="border bg-gray-100">
              <th className="border">Serial</th>
              <th className="border">Order Date</th>
              <th className="border">User Info</th>
              <th className="border py-0">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th colSpan="5">Product Info</th>
                    </tr>
                    <tr>
                      <th className="border-t w-[70px]">Name</th>
                      <th className="border-l border-t w-[70px]">Weight</th>
                      <th className="border-l border-t w-[70px]">Price</th>
                      <th className="border-l border-t w-[70px]">Quantity</th>
                      <th className="border-l border-t w-[70px]">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                </table>
              </th>
              <th className="border">Discount Price</th>
              <th className="border">Shipping Cost</th>
              <th className="border">Total Amount</th>
              <th className="border">Order Status</th>
              <th className="border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr className="border-b">
                <td colSpan="12" className="text-center p-2 border">
                  No order records found for this date.
                </td>
              </tr>
            ) : (
              currentItems.map((order, orderIndex) => {
                return (
                  <React.Fragment key={order.id}>
                    <tr className="border-b">
                      <td className="border">
                        {indexOfFirstItem + orderIndex + 1}
                      </td>
                      <td className="border">
                        {new Date(order.orderDate).toLocaleDateString("en-GB")}
                      </td>
                      <td className="border">
                        {order.userName} <br />
                        {order.userPhone}
                      </td>
                      <td className="border p-0 h-10">
                        {order.orderItems.length > 0 ? (
                          <table className="w-full h-full">
                            <tbody>
                              {order.orderItems.map((item, itemIndex) => (
                                <tr key={itemIndex}>
                                  <td className="border-t w-[70px]">
                                    {item.productName}
                                  </td>
                                  <td className="border-l border-b w-[70px]">
                                    {item.weight}
                                  </td>
                                  <td className="border-l border-b w-[70px]">
                                    {item.price}
                                  </td>
                                  <td className="border-l border-b w-[70px]">
                                    {item.quantity}
                                  </td>
                                  <td className="border-l border-b w-[70px]">
                                    {item.totalPrice.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No items in this order</p>
                        )}
                      </td>
                      <td className="border">{order.discount}</td>
                      <td className="border">{order.shippingCost}</td>
                      <td className="border">{order.totalAmount}</td>
                      <td className="border">
                        <span
                          className={`font-semibold rounded-sm px-2 ${
                            order.orderStatus === 0
                              ? "bg-yellow-100 text-yellow-500"
                              : order.orderStatus === 1
                              ? "bg-green-100 text-green-500"
                              : order.orderStatus === 2
                              ? "bg-red-100 text-red-500"
                              : order.orderStatus === 3
                              ? "bg-gray-100 text-gray-500"
                              : "bg-gray-200 text-gray-700" // Default for unknown status
                          }`}
                        >
                          {statusOptions.find(
                            (s) => s.value === Number(order.orderStatus)
                          )?.name || "Unknown"}
                        </span>
                      </td>
                      <td className="border">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, Number(e.target.value))
                          }
                          disabled={loadingStatus}
                          className="border rounded-md p-1"
                        >
                          {statusOptions.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            )}
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

export default Orders;
