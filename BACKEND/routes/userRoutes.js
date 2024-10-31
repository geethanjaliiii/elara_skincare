const express = require('express')
const {sendOTP,signup, verifyOTP, login,refreshUserToken,googleAuth} = require('../controllers/user/authController')
const {featuredProducts,viewProduct,fetchProducts} =require('../controllers/user/productController')
const {showCategories} =require("../controllers/user/categoryController")
const {showProfile,editProfile}=require('../controllers/user/userController')
const authenticateToken =require('../middlewares/user/authMiddleware')
const {addAddress}=require('../controllers/user/addressController')
const userRoute = express()

//authentication
userRoute.post('/send-otp',sendOTP)
userRoute.post('/refresh-token',refreshUserToken)
userRoute.post('/signup',signup)
userRoute.post('/verify-otp',verifyOTP)
userRoute.post('/login',login)
userRoute.post('/google-auth',googleAuth)
//products
userRoute.get('/products/bestsellers',featuredProducts)
userRoute.get('/products',authenticateToken,fetchProducts)
userRoute.get('/products/:id',authenticateToken,viewProduct)

//categories
userRoute.get('/categories',showCategories)
//profile
userRoute.get('/profile/:id',authenticateToken,showProfile)
userRoute.put('/profile/:id',authenticateToken,editProfile)
//address
userRoute.post('/address',authenticateToken,addAddress)
module.exports = userRoute