const generateReferralCode=()=>{
    const prefix='ELA'
     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
   let randomPart=''
   for(let i=0;i<4;i++){
    randomPart+=chars.charAt(Math.floor(Math.random()*chars.length))
   }

   const timestamp=Date.now().toString(36).toUpperCase();
   return `${prefix}${randomPart}${timestamp}`
}

module.exports=generateReferralCode