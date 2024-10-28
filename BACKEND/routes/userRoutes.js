const express = require('express')
const {sendOTP,signup, verifyOTP, login,refreshUserToken,googleAuth} = require('../controllers/user/userController')
const {featuredProducts,viewProduct} =require('../controllers/user/productController')
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
userRoute.get('/products/:id',authenticateToken,viewProduct)
module.exports = userRoute