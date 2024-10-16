const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');

const tokenKey = process.env.TOKEN_KEY;
const adminTokenKey = process.env.ADMIN_TOKEN_KEY;
const accessExpiration = process.env.ACCESS_TOKEN_EXPIRATION;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY; // Use a separate secret key for refresh tokens
const refreshExpiration = process.env.REFRESH_TOKEN_EXPIRATION;
const adminAccessExpiration = process.env.ADMIN_ACCESS_TOKEN_EXPIRATION;
const adminRefreshExpiration = process.env.ADMIN_REFRESH_TOKEN_EXPIRATION;

const generateAccessToken = (user) => {
    if (!user?.role) {
        console.log("Generating access token for user");
        return jwt.sign({ user }, tokenKey, { expiresIn: accessExpiration });
    }
    return jwt.sign({ user }, adminTokenKey, { expiresIn: adminAccessExpiration });
};

const generateRefreshToken = (user) => {
    if (!user?.role) {
        console.log("Generating refresh token for user");
        return jwt.sign({ user }, refreshTokenKey, { expiresIn: refreshExpiration });
    }
    // Generate refresh token for admin
    return jwt.sign({ user }, adminTokenKey, { expiresIn: adminRefreshExpiration });
};

module.exports = { generateAccessToken, generateRefreshToken };


// const dotenv= require('dotenv')
// dotenv.config()
// const jwt =require('jsonwebtoken')
// const tokenKey = process.env.TOKEN_KEY
// const accessExpiration =process.env.ACCESS_TOKEN_EXPIRATION
// const refreshExpiration =process.env.REFRESH_TOKEN_EXPIRATION
// const generateAccessToken = (user)=>{

//     if(!user?.role){
//         console.log("generating token for user");
//         return jwt.sign({user},tokenKey,{expiresIn: accessExpiration})
//     }
//    return jwt.sign({user},process.env.ADMIN_TOKEN_KEY,{
//     expiresIn:process.env.ADMIN_ACCESS_TOKEN_EXPIRATION
//    })

// }

// const generateRefreshToken = (user)=>{
//     if(!user?.role){
//         return jwt.sign({user},refreshExpiration,{
//             expiresIn: process.env.refreshExpiration
//         })
//     }
// }
// module.exports ={generateAccessToken, generateRefreshToken}