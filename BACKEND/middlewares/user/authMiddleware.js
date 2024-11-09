const jwt=require('jsonwebtoken')
const secretKey= process.env.TOKEN_KEY

function authenticateToken(req,res,next){
    const token =req.headers['authorization']?.split(' ')[1];

    if(!token){
        console.log("no token");
        
        return res.status(401).json({success:false, message:'Access denied, no token provided'})
    }
   
    jwt.verify(token,secretKey,(err,user)=>{
        if(err){
            console.log("invalid token or token expired ",err);
            
            return res.status(401).json({error:"Invalid token"})
        }
        req.user=user
        next()
    })
}
module.exports = authenticateToken