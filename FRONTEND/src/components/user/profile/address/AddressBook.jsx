// AddressBook.jsx

import React, { useEffect, useState } from "react";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/config/axiosConfig";
import toast, { Toaster } from "react-hot-toast";
import { DeleteWarningModal } from "@/components/shared/DeleteWarningModal";

function AddressBook({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen,setIsModalOpen]=useState(false)
  const[deleteId,setDeleteId]=useState(null)
  const [editingAddress, setEditingAddress] = useState(null);
  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response =await axiosInstance.get(`/api/users/addresses/${userId}`)
        setAddresses(response.data.addresses)
      } catch (error) {
        console.log("addresses not fetched",error);
        setAddresses([])
      }
    }
    fetchAddresses();
  }, [ userId]);

  //add new address
  const handleAddAddress = async (values) => {
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
      toast.error("Address not added.Please try again.");
    }
  };

  //edit address
  const handleEditAddress = async(values) => {
    const addrId=values._id
    const { _id, ...filteredValues } = values;
    try {
      const response =  await axiosInstance.put(`/api/users/${addrId}/addresses`,filteredValues)
      const updatedAddress=response.data.updatedAddress
      setAddresses((prev)=>prev.map((addr)=>(addr._id===updatedAddress._id?updatedAddress: addr)))
      setEditingAddress(null)
      toast.success("Address updated.")
    } catch (error) {
        console.log("error updating address",error);
        toast.error("Address not updated.")
    }
  };

  const handleDeleteAddress = async(id) => {
    setIsModalOpen(true)
    setDeleteId(id)
   
  };

  //for modal
  const confirmDelete=async()=>{
    try {
      await axiosInstance.delete(`/api/users/${userId}/addresses/${deleteId}`)
        setAddresses((prev) => prev.filter((addr) => addr._id !== deleteId));
        toast.success("Address deleted successfully.")
        setIsModalOpen(false)
        setDeleteId(null)
    } catch (error) {
        console.log("Address not deleted");
        toast.error('Address deletion failed')
        setIsModalOpen(false)
        setDeleteId(null)
    }
  }
  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isDefault: addr._id === id }))
    );
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {!editingAddress && !isAdding && (
        <Button onClick={() => {setIsAdding(true);setEditingAddress(null)}}>Add a new address</Button>
      )}
      {isAdding && (
        <AddressForm
          initialValues={{}}
          onSubmit={handleAddAddress}
          onCancel={() => setIsAdding(false)}
        />
      )}
      {!editingAddress && addresses?.length>0  && addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={() => {setEditingAddress(address);setIsAdding(false)}}
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
      <DeleteWarningModal isOpen={isModalOpen} onClose={()=>{
        setDeleteId(null);
        setIsModalOpen(false)}}
        onConfirm={confirmDelete}
        statement={'delete the address'}/>
    </div>
  );
}

export default AddressBook;
