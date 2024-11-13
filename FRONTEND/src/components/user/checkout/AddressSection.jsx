import React, { lazy, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import toast,{ Toaster } from "react-hot-toast";
import { Modal } from "@/components/shared/Modal";
import { AddressForm } from "../profile/address/AddressForm";
import { useAddress } from "@/context/AddressContext";
// //lazy load address form component
// const AddressForm =lazy(()=>import('@/components/user/profile/address/AddressForm'))

export default function AddressSection({ onDeliverHere, addresses }) {
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isModalOpen,setIsModalOpen]=useState(false)
  const[addMode,setAddMode]=useState(false)
  const[editMode,setEditMode]=useState(false)
  const{addAddress,editAddress}=useAddress()

  useEffect(() => {
    const defaultAddress = addresses.find((address) => address.isDefault);
    //setting default address as initial value of selectedaddress
    setSelectedAddress(defaultAddress || {});
  }, [addresses]);

 function handleAddAddress(){
  setIsModalOpen(true)
  setAddMode(true)
 }
 function handleCloseModal(){
  setIsModalOpen(false)
  setAddMode(false)
  setEditMode(false)
 }
async function handleAddressSubmit(values){
  try {
    console.log("adding address with values",values);
   await addAddress(values)
  } catch (error) {
    console.log("address adding failed",error);
  }
  setAddMode(false)
  setIsModalOpen(false)
 }

 async function handleEditAddress() {
  console.log("editing");
  
  setIsModalOpen(true)
  setEditMode(true)
 setAddMode(false)

 }
const handleEditSubmit=async(values)=>{
  console.log("try editing with",selectedAddress);
  
  try {
    await editAddress(values)
    toast.success("Address updated.")
  } catch (error) {
    console.log("address adding failed",error);
  }
  setEditMode(false)
  setIsModalOpen(false)
}
  return (
    <Card>
      <Toaster/>
      <CardHeader>
        <CardTitle>Select Delivery Address</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAddress._id || ''} 
        onValueChange={(id)=>setSelectedAddress(addresses.find((address)=>address._id==id))}
        className="space-y-2">
          {addresses &&
            addresses.map((address) => (
              <div
                className="flex items-start space-x-4 rounded-lg border p-4"
                key={address._id}
                onClick={() => {
                  setSelectedAddress(address);
                }}
              >
                <RadioGroupItem
                  value={address._id}
                  id={address._id}
                  className="mt-1"
                  checked={selectedAddress._id === address._id}
                />
                <div className="flex-1">
                  <Label htmlFor="default" className="text-base font-semibold">
                    {address.fullname}
                    <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {address.addressType}
                    </span>
                  </Label>
                  <div className="flex  items-center space-x-3">
                    <p className="text-sm text-muted-foreground">
                      {`${address.addressLine} ,${address.city} ,${address.state}`}
                    </p>
                    <span className="text-sm font-semibold">
                      {" "}
                      -{address.pincode}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {address.phone}
                  </p>
                  {selectedAddress._id === address._id && (
                    <div className=" space-x-4">
                      {/* <Button variant="outline" size="xs" className="text-xs p-2 ">REMOVE</Button> */}
                      <Button
                        variant="outline"
                        size="xs"
                        className="text-xs p-1.5 bg-zinc-300"
                        onClick={handleEditAddress 
                         }
                      >
                        EDIT
                      </Button>
                      <button
                        className=" bg-orange-400 p-1.5 rounded-sm text-xs font-semibold mt-6"
                        onClick={()=>onDeliverHere(selectedAddress)}
                      >
                        DELIVER HERE
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </RadioGroup>
      </CardContent>
      <Button className="mx-6 mb-2" onClick={handleAddAddress}>Add Address</Button>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} >
      {addMode && <AddressForm
          initialValues={{}}
          onSubmit={handleAddressSubmit}
          onCancel={handleCloseModal}
        />}
        {editMode && <AddressForm
        initialValues={selectedAddress}
      onSubmit={handleEditSubmit}
      onCancel={handleCloseModal}/>
    }
      </Modal>
    </Card>
  );
}


// import React, { lazy, useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Button } from "@/components/ui/button";
// import { Toaster } from "react-hot-toast";
// import { useSelector } from "react-redux";
// import { Modal } from "@/components/shared/Modal";
// import { AddressForm } from "../profile/address/AddressForm";
// import { useAddress } from "@/context/AddressContext";
// // //lazy load address form component
// // const AddressForm =lazy(()=>import('@/components/user/profile/address/AddressForm'))

// export default function AddressSection({ onDeliverHere, addresses }) {
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [isModalOpen,setIsModalOpen]=useState(false)
//   const{addAddress}=useAddress()

//   useEffect(() => {
//     const defaultAddress = addresses.find((address) => address.isDefault);
//     //setting default address as initial value of selectedaddress
//     setSelectedAddress(defaultAddress ? defaultAddress._id : null);
//   }, [addresses]);

//  function handleAddAddress(){
//   setIsModalOpen(true)
//  }
//  function handleCloseModal(){
//   setIsModalOpen(false)
//  }
// async function handleAddressSubmit(values){
//   try {
//     console.log("adding address with values",values);
//    await addAddress(values)
//   } catch (error) {
//     console.log("address adding failed",error);
//   }
//   setIsModalOpen(false)
//  }
//  async function handleEditAddress() {
  
//  }

//   return (
//     <Card>
//       <Toaster/>
//       <CardHeader>
//         <CardTitle>Select Delivery Address</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <RadioGroup defaultValue="default" className="space-y-2">
//           {addresses &&
//             addresses.map((address) => (
//               <div
//                 className="flex items-start space-x-4 rounded-lg border p-4"
//                 key={address._id}
//                 onClick={() => {
//                   setSelectedAddress(address._id);
//                 }}
//               >
//                 <RadioGroupItem
//                   value="default"
//                   id="default"
//                   className="mt-1"
//                   checked={selectedAddress === address._id}
//                 />
//                 <div className="flex-1">
//                   <Label htmlFor="default" className="text-base font-semibold">
//                     {address.fullname}
//                     <span className="ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
//                       {address.addressType}
//                     </span>
//                   </Label>
//                   <div className="flex  items-center space-x-3">
//                     <p className="text-sm text-muted-foreground">
//                       {`${address.addressLine} ,${address.city} ,${address.state}`}
//                     </p>
//                     <span className="text-sm font-semibold">
//                       {" "}
//                       -{address.pincode}
//                     </span>
//                   </div>

//                   <p className="text-sm text-muted-foreground">
//                     {address.phone}
//                   </p>
//                   {selectedAddress === address._id && (
//                     <div className=" space-x-4">
//                       {/* <Button variant="outline" size="xs" className="text-xs p-2 ">REMOVE</Button> */}
//                       <Button
//                         variant="outline"
//                         size="xs"
//                         className="text-xs p-1.5 bg-zinc-300"
//                         onClick={handleEditAddress 
//                          }
//                       >
//                         EDIT
//                       </Button>
//                       <button
//                         className=" bg-orange-400 p-1.5 rounded-sm text-xs font-semibold mt-6"
//                         onClick={onDeliverHere}
//                       >
//                         DELIVER HERE
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//         </RadioGroup>
//       </CardContent>
//       <Button className="mx-6 mb-2" onClick={handleAddAddress}>Add Address</Button>
//       <Modal isOpen={isModalOpen} onClose={handleCloseModal} >
//       <AddressForm
//           initialValues={{}}
//           onSubmit={handleAddressSubmit}
//           onCancel={handleCloseModal}
//         />
//       </Modal>
//     </Card>
//   );
// }
