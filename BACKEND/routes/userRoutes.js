const express = require('express')
const {sendOTP,signup, verifyOTP, login,refreshUserToken,googleAuth} = require('../controllers/user/authController')
const {featuredProducts,viewProduct,fetchProducts} =require('../controllers/user/productController')
const {showCategories} =require("../controllers/user/categoryController")
const {showProfile,editProfile}=require('../controllers/user/userController')
const authenticateToken =require('../middlewares/user/authMiddleware')
const {addAddress,showAddresses, editAddress, deleteAddress}=require('../controllers/user/addressController')
const { addToCart, showCart, updateCart, removeItem } = require('../controllers/user/cartController')
const { placeOrder, getOrderDetails ,getAllOrders} = require('../controllers/user/orderController')
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
userRoute.get('/addresses/:userId',authenticateToken,showAddresses)
userRoute.put('/:addressId/addresses',authenticateToken,editAddress)
userRoute.delete('/:userId/addresses/:addressId',authenticateToken,deleteAddress)
//CART
userRoute.post('/:userId/cart',authenticateToken,addToCart)
userRoute.get('/:userId/cart',authenticateToken,showCart)
userRoute.patch('/:userId/cart/:itemId',authenticateToken,updateCart)
userRoute.delete('/:userId/cart/:itemId',authenticateToken,removeItem)

//order
userRoute.post('/orders',authenticateToken,placeOrder)
userRoute.get('/orders/:orderId',authenticateToken,getOrderDetails)
userRoute.get('/:userId/orders',authenticateToken,getAllOrders)

// userRoute.put('/orders/:orderId')
module.exports = userRoute