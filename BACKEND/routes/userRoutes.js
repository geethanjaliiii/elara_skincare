const express = require('express')
const {sendOTP,signup, verifyOTP, login,refreshUserToken} = require('../controllers/user/userController')
const {featuredProducts} =require('../controllers/user/productController')
const authenticateToken =require('../middlewares/user/authMiddleware')
const userRoute = express()

userRoute.post('/send-otp',sendOTP)
userRoute.post('/refresh-token',refreshUserToken)
userRoute.post('/signup',signup)
userRoute.post('/verify-otp',verifyOTP)
userRoute.post('/login',login)
userRoute.get('/bestsellers',authenticateToken,featuredProducts)
module.exports = userRoute