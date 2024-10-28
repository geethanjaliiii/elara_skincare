import React from "react";
import { Truck, RefreshCw, Star, Share2 ,Shield ,ShieldCheck} from "lucide-react"
const DeliveryInfo = () => (
  <div className="space-y-3 mt-6">
  <div className="flex items-center space-x-2">
    <Truck className="h-5 w-5" />
    <span className="text-sm font-bold">Free Delivery</span>
  </div>
  <div className="flex items-center space-x-2">
    <RefreshCw className="h-5 w-5" />
    <span className="text-sm font-bold">30 Days Return Policy</span>
  </div>
  
  
</div>
    
  );
  export default DeliveryInfo