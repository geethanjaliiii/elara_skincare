// AddressBook.jsx

import React, { useState } from "react";
import {AddressCard} from "./AddressCard";
import {AddressForm }from "./AddressForm";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/config/axiosConfig";
import toast, { Toaster } from "react-hot-toast";

function AddressBook({userId}) {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAddAddress = async (values) => {
    try {
      const response = await axiosInstance.post(`/api/users/address`,{...values,userId})
      const newAddress =response.data.address
      setAddresses((prev)=>[...prev,newAddress]);
      toast.success("Address added successfully.")
      setIsAdding(false);
    } catch (error) {
        console.log("New address not added",error);
        toast.error("Address not added.Please try again.")
    }
   
  };

  const handleEditAddress = (values) => {
    setAddresses((prev) => prev.map((addr) => (addr._id === values._id ? values : addr)));
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr._id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: addr._id === id })));
  };

  return (
    <div className="space-y-6">
        <Toaster/>
     {!isAdding && <Button onClick={() => setIsAdding(true)}>Add a new address</Button>} 
      {isAdding && (
        <AddressForm initialValues={{}} onSubmit={handleAddAddress} onCancel={() => setIsAdding(false)} />
      )}
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={() => setEditingAddress(address)}
          onDelete={handleDeleteAddress}
          onSetDefault={handleSetDefault}
        />
      ))}
      {editingAddress && (
        <AddressForm
          initialValues={editingAddress}
          onSubmit={handleEditAddress}
          onCancel={() => setEditingAddress(null)}
        />
      )}
    </div>
  );
}

export default AddressBook;
