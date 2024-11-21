const express = require('express')
const {sendOTP,signup, verifyOTP, login,refreshUserToken,googleAuth,forgetPassword, verifyResetOtp, resetPassword, verifyPassword, changePassword} = require('../controllers/user/authController')
const {featuredProducts,viewProduct,fetchProducts} =require('../controllers/user/productController')
const {showCategories} =require("../controllers/user/categoryController")
const {showProfile,editProfile}=require('../controllers/user/userController')
const authenticateToken =require('../middlewares/user/authMiddleware')
const {addAddress,showAddresses, editAddress, deleteAddress}=require('../controllers/user/addressController')
const { addToCart, showCart, updateCart, removeItem, checkProduct } = require('../controllers/user/cartController')
const { placeOrder, getOrderDetails ,getAllOrders,cancelOrder} = require('../controllers/user/orderController')
const { createOrder, verifyPayment } = require('../controllers/user/paymentController')
const { getCoupons, applyCoupon } = require('../controllers/user/couponController')
const {addToWishlist,removeFromWishlist,getWishlist} = require("../controllers/user/wishlistController");
const { fetchWallet } = require('../controllers/user/walletController')
const userRoute = express()


  
  
//authentication
userRoute.post('/send-otp',sendOTP)
userRoute.post('/refresh-token',refreshUserToken)
userRoute.post('/signup',signup)
userRoute.post('/verify-otp',verifyOTP)
userRoute.post('/login',login)
userRoute.post('/google-auth',googleAuth)
//forget passwords
userRoute.post('/forget-password',forgetPassword)
userRoute.post('/resend-otp',forgetPassword)
userRoute.post('/reset/verify-otp',verifyResetOtp)
userRoute.post('/reset-password',resetPassword)
//change password
userRoute.post('/verify-password/:userId',authenticateToken,verifyPassword)
userRoute.post('/change-password/:userId',authenticateToken,changePassword)
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
userRoute.get('/addresses/:userId',authenticateToken,showAddresses)
userRoute.put('/:addressId/addresses',authenticateToken,editAddress)
userRoute.delete('/:userId/addresses/:addressId',authenticateToken,deleteAddress)
//CART
userRoute.post('/:userId/cart',authenticateToken,addToCart)
userRoute.get('/:userId/cart',authenticateToken,showCart)
userRoute.patch('/:userId/cart/:itemId',authenticateToken,updateCart)
userRoute.delete('/:userId/cart/:itemId',authenticateToken,removeItem)
userRoute.get('/:userId/cart/check',authenticateToken,checkProduct)
//order
userRoute.post('/orders',authenticateToken,placeOrder)
userRoute.get('/orders/:orderId',authenticateToken,getOrderDetails)
userRoute.get('/:userId/orders',authenticateToken,getAllOrders)
userRoute.patch('/orders/:orderId/items/:itemId',authenticateToken,cancelOrder)
// userRoute.put('/orders/:orderId')

//payment
userRoute.post('/payment/create-order',authenticateToken,createOrder)
userRoute.post('/payment/verify-payment',authenticateToken,verifyPayment)

//coupons
userRoute.get('/:userId/coupons',authenticateToken,getCoupons )
userRoute.post('/:userId/coupons',authenticateToken,applyCoupon)

//wishlist
userRoute.post("/add", authenticateToken,addToWishlist);
  userRoute.post("/remove",authenticateToken, removeFromWishlist);
  userRoute.get("/:userId",authenticateToken, getWishlist)
//wallet
userRoute.get('/wallet/:userId',authenticateToken,fetchWallet)
module.exports = userRoute