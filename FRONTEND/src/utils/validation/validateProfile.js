
  // Custom validation function
  export default function validateProfileForm(values) {
    const errors = {};
  
    // Name validation
    if (!values.name.trim()) {
      errors.name = "Full name is required";
    } else if (!/^(?!\s*$).+/.test(values.name)) {
      errors.name = "Full name cannot be empty or spaces only";
    }
  
    // Phone number validation (exactly 10 digits)
    if (!values.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(values.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
  
    // Email validation (basic email pattern check)
    if (!values.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)
    ) {
      errors.email = "Please enter a valid email address";
    }
  
    return Object.keys(errors).length===0
  }
  