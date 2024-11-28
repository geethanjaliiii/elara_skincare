// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { axiosInstance } from "@/config/axiosConfig";
// import { useSelector } from "react-redux";

// export function useCart() {
//   const queryClient = useQueryClient();
//   const userId = useSelector((state) => state?.user?.userInfo?._id);
  
//   // Fetch cart query
//   const {
//     data: cart = { items: [] },
//     isLoading: isCartLoading,
//     error: cartError,
//   } = useQuery({
//     queryKey: ['cart', userId],
//     queryFn: async () => {
//       if (!userId) return { items: [] };
//       const response = await axiosInstance.get(`/api/users/${userId}/cart`);
//       return response.data.cart;
//     },
//     enabled: !!userId,
//   });

//   // Update quantity mutation
//   const updateQuantityMutation = useMutation({
//     mutationFn: async ({ itemId, newQty }) => {
//       const response = await axiosInstance.patch(
//         `/api/users/${userId}/cart/${itemId}`,
//         { quantity: newQty }
//       );
//       return response.data.cart;
//     },
//     onSuccess: (newCart) => {
//       queryClient.setQueryData(['cart', userId], newCart);
//     },
//   });

//   // Remove item mutation
//   const removeItemMutation = useMutation({
//     mutationFn: async (itemId) => {
//       const response = await axiosInstance.delete(
//         `/api/users/${userId}/cart/${itemId}`
//       );
//       return response.data.cart;
//     },
//     onSuccess: (newCart) => {
//       queryClient.setQueryData(['cart', userId], newCart);
//     },
//   });

//   // Add to cart mutation
//   const addToCartMutation = useMutation({
//     mutationFn: async (cartItem) => {
//       const response = await axiosInstance.post(
//         `/api/users/${userId}/cart`,
//         cartItem
//       );
//       return response.data;
//     },
//     onSuccess: (data) => {
//       queryClient.setQueryData(['cart', userId], (oldCart) => ({
//         ...oldCart,
//         items: [...(oldCart?.items || []), data.item],
//       }));
//     },
//   });

//   // Helper functions
//   const checkStock = () => {
//     if (!cart.items || cart.items.length === 0) return false;
    
//     return cart.items.every((item) => {
//       const selectedSize = item.productId.sizes.find(
//         (size) => size.size === item.size
//       );
//       return item.quantity <= selectedSize.stock || selectedSize.stock === 0;
//     });
//   };

//   const allStockOut = () => {
//     return cart.items.every((item) => !item.inStock);
//   };

//   return {
//     // Cart data
//     cart,
//     cartItems: cart.items,
//     isCartLoading,
//     cartError,

//     // Mutations
//     updateQuantity: (itemId, newQty) => 
//       updateQuantityMutation.mutate({ itemId, newQty }),
//     removeItem: (itemId) => removeItemMutation.mutate(itemId),
//     addToCart: (cartItem) => addToCartMutation.mutate(cartItem),
    
//     // Mutation states
//     isUpdating: updateQuantityMutation.isPending,
//     isRemoving: removeItemMutation.isPending,
//     isAdding: addToCartMutation.isPending,
    
//     // Helper functions
//     checkStock,
//     allStockOut,
//   };
// }