const Banner=require('../../models/bannerModel')

const fetchBanners=async(req,res)=>{
    try {
      const banners=  await Banner.find({isActive:true}).limit(4)
      res.status(200).json({success:true,message:"Banners fetched",banners})
    } catch (error) {
        console.log("error fetching banners",error);
        res.status(500).json({success:false,message:"Failed to fetch banners"})
    }
}
module.exports={fetchBanners}