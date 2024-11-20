function checkStock(cartItem) {
    if(!cartItem?.productId?.sizes)return false;
    const sizeData=cartItem.productId?.sizes.find((size)=>size.size==cartItem.size )
    return sizeData?sizeData.stock>0:false
    }

    module.exports=checkStock