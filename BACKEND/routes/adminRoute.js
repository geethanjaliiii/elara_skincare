const express = require('express')
const upload =require('../config/multerConfig')

const {login,getCustomerDetails,editCustomerStatus,logout, refreshAccessToken} = require('../controllers/admin/adminController')
const {addProduct,showProducts,listProduct, showProduct, editProduct}=require('../controllers/admin/productController')
const{addCategory,showCategories,editCategory,listCategory,showCategory}=require('../controllers/admin/categoryController')
const authenticateAdminToken = require('../middlewares/admin/adminAuthMiddleware')
const { getOrders, cancelOrder } = require('../controllers/admin/OrderController')
const adminRoute = express()

//customers
adminRoute.post('/',login)
adminRoute.get('/customers',authenticateAdminToken,getCustomerDetails)
adminRoute.patch('/customers/:userId',authenticateAdminToken,editCustomerStatus)
adminRoute.post('/logout',logout)
adminRoute.post('/refresh-token',refreshAccessToken)
//category
adminRoute.post('/categories',authenticateAdminToken,addCategory)
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
module.exports = adminRoute