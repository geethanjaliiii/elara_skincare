import React, { useState } from "react";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

const CartItem = ({ cartItems, updateQuantity, removeItem }) => {
  console.log(cartItems);
  const handleQtyChange=(id,change)=>{
   const item=cartItems.find((item)=>item._id===id)
   console.log("item",item);
   
   const selectedSize=item.productId.sizes.find((size)=>size.size===item.size)
   console.log(selectedSize);
   
   const newQty=Math.max(1,item.quantity+change)
   if(change==-1){
    updateQuantity(id,newQty)
   }
   else if(newQty<=selectedSize.stock && newQty<=item.maxQtyPerUser){
    updateQuantity(id,newQty)
   }else{
    toast.error('Stock limit exceeded')
   }
   
  }



  return (
    <div className="space-y-6">
      <Toaster/>
      {cartItems &&
        cartItems.map((item) => {
          const selectedSize=item.productId.sizes.find((size)=>size.size===item.size)
          const currentPrice=selectedSize?selectedSize.price*item.quantity:0
          const discountPrice=(currentPrice*item.discount/100)
          const discountedPrice=currentPrice-discountPrice
          return (
            <Card key={item._id}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <img
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    className="rounded-lg object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.productId.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        size: {item.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                  {selectedSize && selectedSize.stock>0 ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>handleQtyChange(item._id, -1)}
                          disabled={item.quantity===1}
                        >
                          <MinusCircle className="h-4 w-4" />
                          <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQtyChange(item._id,1)}
                          disabled={item.quantity>=5 || item.quantity>=selectedSize.stock}
                        >
                          <PlusCircle className="h-4 w-4" />
                          <span className="sr-only">Increase quantity</span>
                        </Button>
                        {selectedSize.stock>0 &&selectedSize.stock<6 && (
                          <div className="text-sm text-red-600 ">
                            only {selectedSize.stock} left!
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          ₹{discountedPrice.toFixed(2)}
                        </div>
                        {currentPrice > discountedPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            ₹{currentPrice.toFixed(2)}
                          </div>
                        )}
                       
                      </div>
                    </div>
                  ) : selectedSize?(
                    <p className="text-sm font-medium text-destructive">
                      Out Of Stock
                    </p>
                  ):<p className="text-sm font-medium text-destructive">
                   Currently Unavailable.
                </p>}
                 
                </div>
              </CardContent>
            </Card>
          );
        })}
      {!cartItems && <div>This cart is empty</div>}
    </div>
  );
};

export default CartItem;
