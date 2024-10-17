const express= require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')
const dotenv = require('dotenv')
const connectDB = require('./config/connectDB')
const userRoute=require('./routes/userRoutes')
const adminRoute =require('./routes/adminRoute')
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

app.use('/api/users',userRoute)

app.use('/api/admin',adminRoute)
app.listen(PORT,()=>{
    console.log(`server is running at`);   
})