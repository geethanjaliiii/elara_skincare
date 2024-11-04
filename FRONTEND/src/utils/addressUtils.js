import { axiosInstance } from "@/config/axiosConfig";
import toast from "react-hot-toast";

export const addAddress = async (userId, values, setAddresses) => {
  try {
    const response = await axiosInstance.post(`/api/users/address`, { ...values, user: userId });
    const newAddress = response.data.address;
    setAddresses((prev) => [...prev, newAddress]);
    toast.success("Address added successfully.");
  } catch (error) {
    console.log("New address not added", error);
    toast.error("Address not added. Please try again.");
  }
};
