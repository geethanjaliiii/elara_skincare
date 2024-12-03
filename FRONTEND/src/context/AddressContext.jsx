import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";
import toast,{Toaster} from "react-hot-toast";

const AddressContext = createContext();

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const userId = useSelector((state) => state?.user?.userInfo?._id);
  const [shippingAddress, setShippingAddress] = useState(()=>{
    const savedAddress=localStorage.getItem("shippingAddress")
    return savedAddress?JSON.parse(savedAddress):{}
  });

  const fetchAddresses = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/api/users/addresses/${userId}`);
      setAddresses(response.data.addresses);
    } catch (error) {
      console.log("Error fetching addresses", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (values) => {
    try {
      const response = await axiosInstance.post(`/api/users/address`, {
        ...values,
        user: userId,
      });
      const newAddress = response.data.address;
      setAddresses((prev) => [...prev, newAddress]);
      toast.success("Address added successfully.");
      setIsAdding(false);
    } catch (error) {
      console.log("New address not added", error);
      toast.error("Address not added. Please try again.");
    }
  };

  const handleDeliverHere = useCallback((address) => {
    setShippingAddress(address);
    localStorage.setItem('shippingAddress',JSON.stringify(address))
    console.log("shipping address is", address);
  }, []);

    //edit address
    const editAddress = async(values) => {
      console.log("submitting updated address",values);
      
      const addrId=values._id
      const { _id, ...filteredValues } = values;
      try {
        const response =  await axiosInstance.put(`/api/users/${addrId}/addresses`,filteredValues)
        const updatedAddress=response.data.updatedAddress
        setAddresses((prev)=>prev.map((addr)=>(addr._id===updatedAddress._id?updatedAddress: addr)))
        
        
      } catch (error) {
          console.log("error updating address",error);
          toast.error("Address not updated.")
      }
    };


  const addressContextValue = useMemo(() => ({
    addresses,
    fetchAddresses,
    addAddress,
    handleDeliverHere,
    editAddress,
    
    shippingAddress
  }), [addresses, fetchAddresses, addAddress, handleDeliverHere,editAddress,shippingAddress]);

  return (
  
    <AddressContext.Provider value={addressContextValue}>
    
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const addressContext = useContext(AddressContext);
  if (!addressContext) {
    throw new Error("useAddress must be within Address provider");
  }
  return addressContext;
}
