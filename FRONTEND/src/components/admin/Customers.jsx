import  { adminAxiosInstance } from "@/config/axiosConfig";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/slices/userSlice";
import { useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";
import { DeleteWarningModal } from "../shared/DeleteWarningModal";
const Customers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const[searchParams,setSearchParams]=useSearchParams()
  const[page,setPage]=useState(parseInt(searchParams.get('page'))||1)
  const[totalPages,setTotalPages]=useState(0)
  const[limit,setLimit]=useState(6)
  const[term,setTerm]=useState("")
  const dispatch =useDispatch()
  const[isModalOpen,setIsModalOpen]=useState(false)
 const[userToBlock,setUserToBlock]=useState(null)

  useEffect(() => {
    // Fetch users from the database/API
    const fetchUsers = async () => {
      try {
        const UserList = await adminAxiosInstance.get("/api/admin/customers",
          {params:{page, limit,term}}
        );
        console.log(UserList?.data?.users);
        setUsers(UserList?.data?.users);
        setTotalPages(UserList.data.totalPages)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [term,editMode,page]);

 const handleSearch =()=>{
  if(searchTerm){
    setTerm(searchTerm)
  }
 }
  const handlePageChange=(newPage)=>{
       setPage(newPage)
       setSearchParams({...Object.fromEntries(searchParams.entries()),page:newPage})
  }
  const handleStatusToggle =(userId) => {
    setIsModalOpen(true)
    setUserToBlock(userId)
  };

  const confirmBlock=async()=>{
    // Toggle user status and refresh data
    try {
      const updatedData = await adminAxiosInstance.patch(`/api/admin/customers/${userToBlock}`);
    console.log(updatedData?.data?.user);
    toast.success("User status changed.")
    dispatch(logoutUser())
    setEditMode(!editMode);
    setIsModalOpen(false)
    setUserToBlock(null)
    console.log(`Toggle status for user with ID: ${userToBlock}`);
    } catch (error) {
      console.log("User block failed");
      setIsModalOpen(false)
      setUserToBlock(null)
    }
  }
  return (
    <div className="p-4 md:p-6">
      <Toaster/>
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
            {users && users.length > 0 ? (
              users.map((user,index) => (
                <>
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{(page-1)*limit+index+1}</td>
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
           
            </>
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
                  {/* Pagination Controls */}
          {  users.length>0 && <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>}
            <DeleteWarningModal isOpen={isModalOpen} onClose={()=>{setIsModalOpen(false); setUserToBlock(null)}} onConfirm={confirmBlock} statement={'change status of the user?'}/>
    </div>
  );
};

export default Customers;

