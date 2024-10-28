"use client";
import { useState, useEffect } from "react";
import TablePagination from "./TablePagination";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("/api/customer");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data.length);
        setUsers(data);
      } catch (err) {
        console.error(err.message || "Failed to load data");
      }
    };

    fetchUserDetails();
  }, []); // Run once on mount

  console.log(users);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div className="container mx-auto overflow-x-auto py-5">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <table className="table-auto w-full text-center text-xs bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2">Serial No</th>
            <th className="border">Name</th>
            <th className="border">Phone</th>
            <th className="border">Address</th>
            <th className="py-2 px-4 border">Last Order Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((user, index) => (
              <tr key={user.id}>
                <td className="py-2 px-2 border text-center">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="py-2 px-2 border">{user.fullname}</td>
                <td className="py-2 px-2 border">{user.phone}</td>
                <td className="py-2 px-2 border">{user.address}</td>
                <td className="py-2 px-2 border text-center">
                  {user.lastOrderDate
                    ? new Date(user.lastOrderDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "No orders yet"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-2 border text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
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

export default UserDetails;
