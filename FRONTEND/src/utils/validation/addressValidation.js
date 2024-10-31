import * as Yup from "yup"

const addressSchema = Yup.object().shape({
    fullname: Yup.string().required("Full name is required"),
    phone: Yup.string().matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    addressLine: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    landmark: Yup.string(),
    pincode: Yup.string().matches(/^[0-9]{6}$/, "Pincode must be 6 digits").required("Pincode is required"),
    addressType: Yup.string().oneOf(["Home", "Work"], "Invalid address type").required("Address type is required"),
    isDefault: Yup.boolean(),
  })

  export default addressSchema