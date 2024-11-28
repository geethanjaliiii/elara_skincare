import { addCoupon, fetchCoupons } from "@/components/admin/api/couponsApi";
import { applyCoupon, changeCouponStatus, getAvaliableCoupons, showCoupons } from "@/services/coupon";
import { useQuery,useMutation,useQueryClient } from "@tanstack/react-query";

export const useCoupons=()=>{
    return useQuery({
        queryKey:['coupons'],
        queryFn:fetchCoupons,
        staleTime:1000*60*5  // cache data for 5 minutes
    })
}
export const useAddCouponMutation=()=>{
    const queryClient=useQueryClient()
    
    return useMutation({
        mutationFn:addCoupon,
        onSuccess:()=>{
            queryClient.invalidateQueries(['coupons'])
            queryClient.invalidateQueries(['userCoupons'])
        },
        onError:(error)=>{
            console.error("Error adding coupon:", error?.response?.data?.message || error.message);
        }
        
    })
}

export const useAvailableCoupons=(cartValue,userId)=>{
    console.log("cartvalue",cartValue,userId);
    
    return useQuery({
        queryKey:['availableCoupons',cartValue,userId],
        queryFn:()=>getAvaliableCoupons(cartValue,userId),
    })
}

export const useAllCoupons=()=>{
    console.log("coupon listing");
    return useQuery({
        queryKey:['userCoupons'],
        queryFn:showCoupons
    })
    
}
export const useApplyCouponMutation=()=>{
    return useMutation({
        mutationFn:({userId,code,cartValue})=>applyCoupon(userId,code,cartValue),
        
        onError:(error)=>{
            console.error("Error applying coupon:", error?.response?.data?.message || error.message);
        }
        
    })
  }
  
export const useToggleCoupon=()=>{
    const queryClient=useQueryClient()
    console.log("calling mutation");
    
    return useMutation({
        mutationFn:(couponId)=>changeCouponStatus(couponId),
        onSuccess:()=>{
            queryClient.invalidateQueries(['coupons'])
            queryClient.invalidateQueries(['userCoupons'])
            queryClient.invalidateQueries(['availableCoupons'])
        },
        onError: (error) => {
            console.error("Error toggling coupon status:", error);
          },
    })
}

  