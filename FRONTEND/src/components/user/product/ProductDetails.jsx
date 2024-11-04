import React from "react";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProductDetails(product) {
  const {  categoryId, ingredient, skinType } = product;
  return (
    <div className="w-full max-w-md p-3">
      <Separator />
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold mt-2">Specifications</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {categoryId && (
              <>
                <div className="text-gray-500">Category</div>
                <div>{categoryId.name}</div>
              </>
            )}
            <div className="text-gray-500">Key Ingredient</div>
            <div>{ingredient}</div>
            <div className="text-gray-500">Skin Type</div>
            <div>{skinType}</div>
            <div className="text-gray-500">Sustainable</div>
            <div>Regular</div>
          </div>
        </div>
        <Separator />
      </CardContent>
    </div>
  );
}
