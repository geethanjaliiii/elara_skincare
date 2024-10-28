import React, { useEffect, useState } from "react";
import ViewProduct from "@/components/user/ViewProduct";
import axiosInstance from "@/config/axiosConfig";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Separator } from "@radix-ui/react-select";
import ProductDetailsTabs from "../../components/user/ProductDetailsTab";
const ProductPage = () => {
  const [product, setProduct] = useState({});
  const location = useLocation();
  const { productId } = location.state;

  const dummyReviews = [
    {
      id: "1",
      title: "Great Product!",
      rating: 5,
      comment: "Great product! Very good quality.",
      author: "Nicolas Cage",
      date: "3 days ago",
    },
    {
      id: "2",
      title: "The best product in market",
      rating: 5,
      comment: "The best product I have ever used.",
      author: "Sr Robert Downey",
      date: "3 days ago",
    },
  ];
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axiosInstance.get(
          `/api/users/products/${productId}`
        );
        if (!response.data.product) {
          console.log("product not found");
          return;
        }
        setProduct(response.data.product);
      } catch (error) {
        console.log("error fetching product", error);
      }
    }

    fetchProduct();
  }, [productId]);
  return (
    <div>
      <Navbar />
      <ViewProduct product={product} />
      <Separator />
      <ProductDetailsTabs
        description={product.description}
        reviews={dummyReviews}
      />
      <Footer />
    </div>
  );
};

export default ProductPage;
