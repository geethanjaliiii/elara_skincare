import { createContext, useContext, useState } from "react";

const CouponContext = createContext();

export const useCoupon = () => useContext(CouponContext);

export const CouponProvider = ({ children }) => {
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  return (
    <CouponContext.Provider
      value={{ couponCode, setCouponCode, couponDiscount, setCouponDiscount }}
    >
      {children}
    </CouponContext.Provider>
  );
};
