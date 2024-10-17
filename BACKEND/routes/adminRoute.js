const express = require('express')
const {login,getCustomerDetails,editCustomerStatus} = require('../controllers/adminController')
const adminRoute = express()

adminRoute.post('/',login)
adminRoute.get('/customers',getCustomerDetails)
adminRoute.patch('/customers/:userId',editCustomerStatus)
module.exports = adminRoute