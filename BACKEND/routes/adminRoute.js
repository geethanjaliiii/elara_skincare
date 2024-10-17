const express = require('express')
const {login} = require('../controllers/adminController')
const adminRoute = express()

adminRoute.post('/',login)
module.exports = adminRoute