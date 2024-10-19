const express = require('express')
const {sendOTP,signup, verifyOTP, login} = require('../controllers/user/userController')
const userRoute = express()

userRoute.post('/send-otp',sendOTP)
userRoute.post('/signup',signup)
userRoute.post('/verify-otp',verifyOTP)
userRoute.post('/login',login)
module.exports = userRoute