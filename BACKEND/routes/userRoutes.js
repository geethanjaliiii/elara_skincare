const express = require('express')
const {sendOTP,signup, verifyOTP, login,refreshUserToken,googleAuth} = require('../controllers/user/userController')
const {featuredProducts,viewProduct,fetchProducts} =require('../controllers/user/productController')
const {showCategories} =require("../controllers/user/categoryController")
const authenticateToken =require('../middlewares/user/authMiddleware')
const userRoute = express()

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
module.exports = userRoute