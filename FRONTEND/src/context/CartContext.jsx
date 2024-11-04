import { createContext,useContext,useState,useEffect } from "react";
import { axiosInstance } from "@/config/axiosConfig";
import { useSelector } from "react-redux";

const CartContext = createContext();

export function CartProvider({children}){
    console.log("cart provider mounterd");
    
    const [cart,setCart]=useState({})
    const [cartItems, setCartItems] = useState([]);
  const userId = useSelector((state) => state?.user.userInfo._id);

  async function fetchCart() {
    if (userId) {
      try {
          console.log("User ID:", userId); 
        const response = await axiosInstance.get(`/api/users/${userId}/cart`);
        const { items, ...cartInfo } = response.data.cart;
        setCart(response.data.cart);
        setCartItems(items);
        console.log("cart items fetched");
        
      } catch (error) {
        console.log("Cart not found", error);
      }
    }
  }

  useEffect(() => {
    fetchCart();
  }, [userId]);

  // Helper functions to update cart items
  const updateQuantity = async (itemId, newQty) => {
    try {
      const response = await axiosInstance.patch(`/api/users/${userId}/cart/${itemId}`, { quantity: newQty });
      setCart(response.data.cart);
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.log("Error updating quantity", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/api/users/${userId}/cart/${itemId}`);
      setCart(response.data.cart);
      setCartItems(response.data.cart.items);
    } catch (error) {
      console.log("Error removing item", error);
    }
  }
  return (
    <CartContext.Provider value={{cart,cartItems,updateQuantity,removeItem,fetchCart}}>
        {children}
    </CartContext.Provider>
  )
  
}
export function useCart(){
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("useCart must be used within a CartProvider");
    }
    console.log("cartcontxt",context);
    
    return context;
  }