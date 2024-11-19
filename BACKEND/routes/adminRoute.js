const express = require('express')
const upload =require('../config/multerConfig')
const {getCustomerDetails,editCustomerStatus,}=require('../controllers/admin/userController')
const {login, logout, refreshAccessToken} = require('../controllers/admin/adminController')
const {addProduct,showProducts,listProduct, showProduct, editProduct}=require('../controllers/admin/productController')
const{addCategory,showCategories,editCategory,listCategory,showCategory}=require('../controllers/admin/categoryController')
const authenticateAdminToken = require('../middlewares/admin/adminAuthMiddleware')
const { getOrders, cancelOrder, updateStatus } = require('../controllers/admin/OrderController')
const { createCoupon, deleteCoupon, showCoupons } = require('../controllers/admin/couponController')
const {fetchProducts,createProductoffer, createCategoryoffer,fetchOffers, listedCategories}=require('../controllers/admin/offerController')
const adminRoute = express()

//customers
adminRoute.post('/',login)
adminRoute.get('/customers',authenticateAdminToken,getCustomerDetails)
adminRoute.patch('/customers/:userId',authenticateAdminToken,editCustomerStatus)
adminRoute.post('/logout',logout)
adminRoute.post('/refresh-token',refreshAccessToken)
//category
adminRoute.post('/categories',authenticateAdminToken,addCategory)
adminRoute.get('/categories/offer',authenticateAdminToken,listedCategories)
adminRoute.get('/categories',authenticateAdminToken,showCategories)
adminRoute.put('/categories/:catId',authenticateAdminToken,editCategory)
adminRoute.get('/categories/:catId',authenticateAdminToken,showCategory)
adminRoute.patch('/categories/list/:categoryId',authenticateAdminToken,listCategory)

//products
adminRoute.post('/products',authenticateAdminToken,upload.array('images',4),addProduct)
adminRoute.get('/products',authenticateAdminToken,showProducts)
adminRoute.patch('/products/:id',authenticateAdminToken,listProduct)
adminRoute.get('/products/:_id',authenticateAdminToken,showProduct)
adminRoute.put('/products/:_id',authenticateAdminToken,upload.array('images',4),editProduct)

//orders
adminRoute.get('/orders',authenticateAdminToken,getOrders)
adminRoute.patch('/orders/:orderId/cancel/:itemId',authenticateAdminToken,cancelOrder)
adminRoute.patch('/orders/:orderId/items/:itemId',authenticateAdminToken,updateStatus)

//coupons
adminRoute.post('/coupons',authenticateAdminToken,createCoupon)
adminRoute.delete('/coupons',authenticateAdminToken,deleteCoupon)
adminRoute.get('/coupons',authenticateAdminToken,showCoupons)

//offers
adminRoute.get('/offers',authenticateAdminToken,fetchOffers)
adminRoute.post('/offers/products',authenticateAdminToken,createProductoffer)
adminRoute.post('/offers/categories',authenticateAdminToken,createCategoryoffer)

adminRoute.get('/offers/products',authenticateAdminToken,fetchProducts)
module.exports = adminRoute