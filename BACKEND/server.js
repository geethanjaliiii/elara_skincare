const express= require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const dotenv = require('dotenv')
const connectDB = require('./config/connectDB')
dotenv.config()

const app = express()
const PORT = process.env.PORT

connectDB()

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.listen(PORT,()=>{
    console.log(`server is running at`);   
})