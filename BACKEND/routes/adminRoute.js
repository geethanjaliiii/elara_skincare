const express = require('express')
const upload =require('../config/multerConfig')

const {login,getCustomerDetails,editCustomerStatus} = require('../controllers/admin/adminController')
const {addProduct}=require('../controllers/admin/productController')
const{addCategory,showCategories,editCategory,listCategory,showCategory}=require('../controllers/admin/categoryController')
const adminRoute = express()

adminRoute.post('/',login)
adminRoute.get('/customers',getCustomerDetails)
adminRoute.patch('/customers/:userId',editCustomerStatus)
//category
adminRoute.post('/categories',addCategory)
adminRoute.get('/categories',showCategories)
adminRoute.put('/categories/:catId',editCategory)
adminRoute.get('/categories/:catId',showCategory)
adminRoute.patch('/categories/list/:categoryId',listCategory)
 
//products
adminRoute.post('/products',upload.array('images',4),addProduct)
module.exports = adminRoute