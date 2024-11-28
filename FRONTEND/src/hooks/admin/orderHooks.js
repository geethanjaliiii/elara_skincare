import { approveReturn, declineReturn } from "@/components/admin/api/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useApproveMutation=(toast)=>{
    const queryClient=useQueryClient()
    return useMutation({
mutationFn:({orderId,itemId})=>approveReturn(orderId,itemId),
onSuccess:(data)=>{
    toast.success("Return approved.")
    queryClient.invalidateQueries(['orders'])
    queryClient.invalidateQueries(['userOrders'])
},
onError:(error)=>{
    console.error("error approving",error);
    
    toast.error("Failed to approve return.")
}
    })
}

export const useDeclineMutation=(toast)=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:({orderId,itemId})=>declineReturn(orderId,itemId),
        onSuccess:(data)=>{
            toast.success("Return request declined")
            queryClient.invalidateQueries(['orders'])
        },
        onError:(error)=>{
            console.error("error decline",error);
            
            toast.error("Failed to decline request.")
        }
    })
}