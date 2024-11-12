import  { adminAxiosInstance } from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
const Customers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const dispatch =useDispatch()
  useEffect(() => {
    // Fetch users from the database/API
    const fetchUsers = async () => {
      try {
        const UserList = await adminAxiosInstance.get("/api/admin/customers");
        console.log(UserList?.data?.users);
        setUsers(UserList?.data?.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [searchTerm, editMode]);

  // Handle search operation
  function handleSearch() {
    const regex = new RegExp(searchTerm, "i");
    const searchResult = users.filter(
      (user) => regex.test(user.name) || regex.test(user.email)
    );
    setUsers(searchResult);
  }

  const handleStatusToggle = async (userId) => {
    // Toggle user status and refresh data
    try {
      const updatedData = await adminAxiosInstance.patch(`/api/admin/customers/${userId}`);
    console.log(updatedData?.data?.user);
    dispatch(logoutUser())
    setEditMode(!editMode);
    console.log(`Toggle status for user with ID: ${userId}`);
    } catch (error) {
      console.log("User block failed");
     
    }
    
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search customers by name or email."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full md:w-1/2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-full md:w-auto"
        >
          Search
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">User Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user,index) => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{index+1}</td>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.phone}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleStatusToggle(user._id)}
                      className={`px-2 py-1 rounded ${
                        user.isBlocked
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {user.isBlocked ? "Unblock User" : "Block User"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-2 px-4 border-b text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;

