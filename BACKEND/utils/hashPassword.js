const bcrypt =require('bcrypt')
const hashPassword = async (password) => {
    try {
      const securePassword = await bcrypt.hash(password, 10);
      console.log("password hashed", securePassword);
  
      return securePassword;
    } catch (error) {
      console.log("error in hashing password");
    }
  };

  module.exports=hashPassword