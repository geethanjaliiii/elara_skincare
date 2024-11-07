const Order =require('../models/orderModel')

 const generateOrderNumber=async()=>{
    try {
        //get current date in YYYYMMDD format
        const datePart=new Date().toISOString().slice(0,10).replace(/-/g,"");

       // Generate a random 4-digit number (0000 to 9999)
    const sequencePart = Math.floor(1000 + Math.random() * 9000).toString();
        
        //combine parts
        return `ELA${datePart}${sequencePart}`
    } catch (error) {
        console.log("error generating orderid",error);
        
    }
}
module.exports =generateOrderNumber