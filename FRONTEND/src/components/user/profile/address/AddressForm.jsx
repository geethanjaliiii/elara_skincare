// AddressForm.tsx

import React from "react"
import { Formik, Form } from "formik"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import addressSchema from "@/utils/validation/addressValidation"


export function AddressForm({ initialValues, onSubmit, onCancel }) {
  console.log("address for editing",initialValues);
  
  return (
    <Formik 
    initialValues={{ ...initialValues, isDefault: false }}
     validationSchema={addressSchema}
      onSubmit={onSubmit}>
      {({ values, errors, touched, handleChange, handleBlur ,isSubmitting}) => (
         <Form className="space-y-4">
         <div className="grid gap-4 md:grid-cols-2">
           <div className="space-y-2">
             <Label htmlFor="fullname">Full Name</Label>
             <Input
               id="fullname"
               name="fullname"
               value={values.fullname}
               onChange={handleChange}
               onBlur={handleBlur}
             />
             {touched.fullname && errors.fullname && (
               <p className="text-sm text-red-500">{errors.fullname}</p>
             )}
           </div>
           <div className="space-y-2">
             <Label htmlFor="phone">Phone Number</Label>
             <Input
               id="phone"
               name="phone"
               value={values.phone}
               onChange={handleChange}
               onBlur={handleBlur}
             />
             {touched.phone && errors.phone && (
               <p className="text-sm text-red-500">{errors.phone}</p>
             )}
           </div>
         </div>

         <div className="space-y-2">
           <Label htmlFor="email">Email</Label>
           <Input
             id="email"
             name="email"
             type="email"
             value={values.email}
             onChange={handleChange}
             onBlur={handleBlur}
           />
           {touched.email && errors.email && (
             <p className="text-sm text-red-500">{errors.email}</p>
           )}
         </div>

         <div className="space-y-2">
           <Label htmlFor="addressLine">Address</Label>
           <Input
             id="addressLine"
             name="addressLine"
             value={values.addressLine}
             onChange={handleChange}
             onBlur={handleBlur}
           />
           {touched.addressLine && errors.addressLine && (
             <p className="text-sm text-red-500">{errors.addressLine}</p>
           )}
         </div>

         <div className="grid gap-4 md:grid-cols-3">
           <div className="space-y-2">
             <Label htmlFor="city">City</Label>
             <Input
               id="city"
               name="city"
               value={values.city}
               onChange={handleChange}
               onBlur={handleBlur}
             />
             {touched.city && errors.city && (
               <p className="text-sm text-red-500">{errors.city}</p>
             )}
           </div>
           <div className="space-y-2">
             <Label htmlFor="state">State</Label>
             <Input
               id="state"
               name="state"
               value={values.state}
               onChange={handleChange}
               onBlur={handleBlur}
             />
             {touched.state && errors.state && (
               <p className="text-sm text-red-500">{errors.state}</p>
             )}
           </div>
           <div className="space-y-2">
             <Label htmlFor="pincode">Pincode</Label>
             <Input
               id="pincode"
               name="pincode"
               value={values.pincode}
               onChange={handleChange}
               onBlur={handleBlur}
             />
             {touched.pincode && errors.pincode && (
               <p className="text-sm text-red-500">{errors.pincode}</p>
             )}
           </div>
         </div>

         <div className="space-y-2">
           <Label htmlFor="landmark">Landmark (Optional)</Label>
           <Input
             id="landmark"
             name="landmark"
             value={values.landmark}
             onChange={handleChange}
             onBlur={handleBlur}
           />
         </div>

         <div className="grid gap-4 md:grid-cols-2">
           <div className="space-y-2">
             <Label>Address Type</Label>
             <Select
               name="addressType"
               value={values.addressType}
               onValueChange={(value) => handleChange({
                 target: { name: "addressType", value }
               })}
             >
               <SelectTrigger>
                 <SelectValue placeholder="Select address type" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Home">Home</SelectItem>
                 <SelectItem value="Work">Work</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div className="flex items-center space-x-2">
             <input
               type="checkbox"
               id="isDefault"
               name="isDefault"
               checked={values.isDefault}
               onChange={handleChange}
               className="h-4 w-4 rounded border-gray-300"
             />
             <Label htmlFor="isDefault">Set as default address</Label>
           </div>
         </div>

         <div className="flex justify-end space-x-2">
           <Button type="button" variant="outline" onClick={onCancel}>
             Cancel
           </Button>
           <Button type="submit" disabled={isSubmitting}>
             Save Address
           </Button>
         </div>
       </Form>
      )}
    </Formik>
  )
}
