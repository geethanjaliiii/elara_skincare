import { sendReturnRequest } from "@/services/orderService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useReturnMutation=(toast)=>{
    const queryClient=useQueryClient()
    return useMutation({
        mutationFn:(data)=>sendReturnRequest(data),
        onSuccess:(data)=>{
        toast.success("Return request sent."),
        queryClient.invalidateQueries(['orders'])
        },
        onError:(error)=>{
            toast.error("Return request not sent.")
        }
    })
}