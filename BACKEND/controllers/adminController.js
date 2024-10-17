
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check user
    //check password
    const admin = await Admin.findOne({ email });

    if (admin) {
      const checkPassword = await bcrypt.compare(password, admin.password);
      if (checkPassword) {
        //generate token
        //send response
        res
          .status(200)
          .json({ success: true, message: "Admin logged in successfully.",
            admin:{
                id:admin._id,
                name:admin.name,
                email:admin.email,
                role:admin.role
            }
           });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password!" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }
  } catch (error) {
    console.log("error in admin login", error);
    res.json({success:false,message: "Login failed",error})
  }
};

module.exports = { login };
