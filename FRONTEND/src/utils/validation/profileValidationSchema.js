import * as Yup from 'yup';

const profileValidationSchema = Yup.object({
    name: Yup.string()
      .trim() // Removes leading and trailing spaces
      .strict(true) // Ensures it does not allow spaces-only input
      .matches(/^(?!\s*$).+/, "Full name cannot be empty or spaces only")
      .required("Full name is required"),
      
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
  
    email: Yup.string()
      .trim() // Removes leading and trailing spaces
      .strict(true) // Ensures it does not allow spaces-only input
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
  });
  export default profileValidationSchema
