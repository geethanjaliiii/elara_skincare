const express = require('express')
const {sendOTP,signup, verifyOTP} = require('../controllers/userController')
const userRoute = express()

userRoute.post('/send-otp',sendOTP)
userRoute.post('/signup',signup)
userRoute.post('/verify-otp',verifyOTP)
module.exports = userRoute