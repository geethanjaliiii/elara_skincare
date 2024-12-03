import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-4 border rounded-md">
          <Skeleton height={150} />
          <Skeleton height={20} width="80%" className="mt-2" />
          <Skeleton height={15} width="60%" className="mt-1" />
          <Skeleton height={30} width="40%" className="mt-2" />
        </div>
      ))}
    </div>
  );
}
export default ProductSkeleton