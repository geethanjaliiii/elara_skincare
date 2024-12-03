const Banner=require('../../models/bannerModel')

const fetchBanners=async(req,res)=>{
    try {
       const banners= await Banner.find()
       res.status(200).json({success:true,message:"Banners fetched",banners})
    } catch (error) {
        console.log("failed to fetch banners");
        res.status(500).json({success:false,message:"Banners not fetched"})
    }
}

const addBanner=async(req,res)=>{
    try {
       const {title,content,isActive,image} =req.body
       if(!title.trim()||!content.trim()||!image){
        return res.status(400).json({success:false,message:"Please fill the required fields."})
       }
      const bannerExist= await Banner.findOne({title})
      if(bannerExist){
        return res.status(403).json({success:false,message:"Banner already exist in this title."})
      }
      const newBanner=new Banner({
        title:title,
        content:content,
        isActive:isActive,
        image:image
      })
      await newBanner.save()
      res.status(201).json({success:true,message:"Banner created successfully."})
    } catch (error) {
        console.error("Failed to create banner",error);
        res.status(500).json({success:false,message:"Failed to create banner"})
    }
}

 const deleteBanner=async(req,res)=>{
    try {
        const {bannerId}=req.params
        if(!bannerId){
            return res.status(400).json({success:false,message:"Please provide a valid request"})
        }
       const banner= await Banner.findById(bannerId)
       if(!banner){
        return res.status(404).json({message:"banner not found"})
       }
       banner.isActive=!banner.isActive
       await banner.save()
       res.status(200).json({message:"Banner status changed"})
    } catch (error) {
        console.error("Failed to update status ofbanner",error);
        res.status(500).json({success:false,message:"banner status not changed"})
    }
}

 const updateBanner=async(req,res)=>{
    try {
        const{bannerId}=req.params
        const updatedData=req.body
        const {title}=req.body
       const bannerExist= await Banner.findOne({title})
       if(bannerExist && bannerExist._id.toString()!=bannerId ){
       return res.status(403).json({success:false,message:"Banner already exist in the title."})
       }
     
       await Banner.findByIdAndUpdate(bannerId,{$set:updatedData})
       res.status(200).json({success:true,message:"Banner updated"})
    } catch (error) {
        console.log("Error updating banner",error);
        res.status(500).json({success:false,message:"Failed to update banner"})
        
    }
}
module.exports={fetchBanners,addBanner,deleteBanner,updateBanner}