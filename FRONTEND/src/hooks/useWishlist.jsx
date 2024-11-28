import { axiosInstance } from "@/config/axiosConfig";
import { getWishlist, removeFromWishlist ,toggleWishlistItem} from "@/services/wishlist";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"



export const useWishlist=(userId)=>{
    const queryClient=useQueryClient();
    const {data:wishlistData,isLoading,isError}=useQuery(
        {queryKey:['wishlist',userId],
            queryFn:()=>getWishlist({userId}),
            enabled: !!userId,
            staleTime: 30000, // Consider data fresh for 30 seconds
            cacheTime: 300000, // Keep data in cache for 5 minutes
            retry: 1, // Only retry failed requests twice
            refetchOnWindowFocus: false, // Prevent refetch on window focus
        }
    );

    const toggleMutation=useMutation({
        mutationFn:toggleWishlistItem,
        onSuccess:()=>{
            queryClient.invalidateQueries(['wishlist',userId])
        }
    });

    const removeMutation=useMutation({
        mutationFn:removeFromWishlist,
        onSuccess:()=>{
            queryClient.invalidateQueries(['wishlist',userId])
        }
    });

    return {
        wishlistData,
        isLoading,
        toggleWishlist:toggleMutation.mutate,
        removeWishlist:removeMutation.mutate
    }
}
// const queryClient = useQueryClient();
//   const {
//     data: wishlistData,
//     isLoading,
//     isError
//   } = useQuery({
//     queryKey: ['wishlist', userId],
//     queryFn: () => getWishlist({ userId }),
//     enabled: !!userId,
//     staleTime: 30000, // Consider data fresh for 30 seconds
//     cacheTime: 300000, // Keep data in cache for 5 minutes
//     retry: 1, // Only retry failed requests twice
//     refetchOnWindowFocus: false, // Prevent refetch on window focus
//   });

//   const mutation=useMutation({
//     mutationFn:({itemId})=>removeFromWishlist({userId,itemId}),
//     onSuccess:()=>{
//       queryClient.invalidateQueries(['wishlist',userId])
//     },
//     onError:(error)=>{console.log("error removing item from wishlist",error)}
//   })
//  async function handleRemoveFromWishlist(itemId) {
//   mutation.mutate({itemId})
//  } 