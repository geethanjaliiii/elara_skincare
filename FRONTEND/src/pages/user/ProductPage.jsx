import React, { useEffect, useState } from "react";
import ViewProduct from "@/components/user/ViewProduct";
import {axiosInstance} from "@/config/axiosConfig";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Separator } from "@radix-ui/react-select";
import ProductDetailsTabs from "../../components/user/ProductDetailsTab";
import RelatedProducts from "@/components/user/product/RelatedProducts";
const ProductPage = () => {
  const [product, setProduct] = useState({});
  const [relatedProducts,setRelatedProducts]=useState([])
  const { _id } = useParams()
 
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
          `/api/users/products/${_id}`
        );
        if (!response.data.product) {
          console.log("product not found");
          return;
        }
        
        setProduct(response.data.product);
        if(response?.data?.relatedProducts){
          setRelatedProducts(response.data.relatedProducts)
        }
        console.log(response.data.product,'product');
        
      } catch (error) {
        console.log("error fetching product", error);
      }
    }

    fetchProduct();
  }, [_id]);
  return (
    <div>
      <Navbar />
      <ViewProduct product={product} />
      <Separator />
      <ProductDetailsTabs
        description={product.description}
        reviews={dummyReviews}
      />
     {relatedProducts?.length>0 && (<RelatedProducts products={relatedProducts}/>)} 
      <Footer />
    </div>
  );
};

export default ProductPage;
