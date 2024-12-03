import { createContext, useContext, useState, useEffect } from "react";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const userId = useSelector((state) => state?.user?.userInfo?._id);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  async function checkStock() {
    try {
     const response= await axiosInstance.get(`/api/users/${userId}/cart/stock`)
     console.log(response.data.inStock);
     
     return response?.data?.inStock
    } catch (error) {
      console.log("Error checking stock");
      
    }
   
  }
  //  function checkStock() {
    
  //   console.log("checking..");
  //   if(!cart.items || cart.items.length<0) return false
  //   for (let item of cart.items) {
  //     const selectedSize = item.productId.sizes.find(
  //       (size) => size.size === item.size
  //     );
  //     console.log("selectedsiz",selectedSize);
      
  //     if (selectedSize.stock===0||(item.quantity > selectedSize.stock && selectedSize.stock!=0)) {
  //       console.log("quantity exceeded",item.quantity);
        
  //       return false;
  //     }
   
  //   }
  //   console.log("quantity not exceeded");
    
  //   return true;
  // }
  function allStockOut(){
    return cartItems.every((item)=>!item.inStock)
  }
  async function fetchCart() {
    if (userId) {
      try {
        const response = await axiosInstance.get(`/api/users/${userId}/cart`);
        const { items, ...cartInfo } = response.data.cart;
        setCart(response.data.cart);
        setCartItems(items);
       
      } catch (error) {
        console.log("Cart not found", error);
      }
    }
  }

  
  // Helper functions to update cart items
  const updateQuantity = async (itemId, newQty) => {
    try {
      const response = await axiosInstance.patch(
        `/api/users/${userId}/cart/${itemId}`,
        { quantity: newQty }
      );
      setCart(response.data.cart);
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.log("Error updating quantity", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/users/${userId}/cart/${itemId}`
      );
      console.log(response.data);
      
      setCart(response.data.cart);
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.log("Error removing item", error);
    }
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        updateQuantity,
        removeItem,
        fetchCart,
        checkStock,
        allStockOut
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
