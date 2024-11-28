import jsPDF from "jspdf";
import 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';

export const generateInvoice = (data) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text('Invoice', 20, 20);

  // Header information (Seller and Buyer info)
  doc.setFontSize(12);
  doc.text("Sold By: ELARA Private Limited", 20, 30);
  doc.text("Ship-from Address: NDR warehouse, Coimbatore, Tamil Nadu", 20, 50);

  // Order number and dates
  doc.setFontSize(12);
  doc.text(`Order ID: ${data.orderNumber}`, 150, 30);
  doc.text(`Order Date: ${new Date(data.orderDate).toLocaleDateString()}`, 150, 40);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 50);

  // Billing and Shipping information
  doc.text("Bill to", 20, 60);
  doc.text(`${data.shippingAddress.fullName}`, 20, 70);
  doc.text(`${data.shippingAddress.addressLine}`, 20, 80);
  doc.text(`Phone: ${data.shippingAddress.phone || 'xxxxxxxxxx'}`, 20, 90);

  doc.text("Ship To", 150, 60);
  doc.text(`${data.shippingAddress.fullName}`, 150, 70);
  doc.text(`${data.shippingAddress.addressLine}`, 150, 80);
  doc.text(`Phone: ${data.shippingAddress.phone || 'xxxxxxxxxx'}`, 150, 90);

  // Invoice Number (with unique identifier)
  doc.text(`Invoice Number # FAB${uuidv4()}`, 150, 120);

  // Filter and map the items data
  const items = data.items.filter(item => item.status === 'Delivered' && item.PaymentStatus === 'Paid').map(item => [
    item.productId.name, 
    item.size, 
    item.quantity, 
    `₹${item.price}`, 
    `₹${item.price * item.quantity}`
  ]);

  // Debug: Check the items array content
  console.log("Items Array: ", items);  // Check if this array has valid data

  if (items.length > 0) {
    // Product info table
    doc.autoTable({
      head: [['Product', 'Size', 'Quantity', 'Price', 'Total']],
      body: items,
      startY: 130,
    });
  } else {
    // If no items match the filter criteria, print a message
    doc.text("No delivered items available.", 20, 130);
  }

  // Add summary section after the table
  const summaryY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 150;  // Ensure summary starts after the table
  doc.text(`Subtotal: ₹${data.totalMRP}`, 20, summaryY);
  doc.text(`Discount: ₹${data.totalDiscount}`, 20, summaryY + 10);
  doc.text(`Shipping Fee: ₹${data.shippingFee}`, 20, summaryY + 20);
  
  if (data.couponDiscount !== 0) {
    doc.text(`Coupon (${data.couponCode}): -₹${data.couponDiscount}`, 20, summaryY + 30);
  }
  
  doc.text(`Total: ₹${data.totalAmount}`, 20, summaryY + 40);

  // Trigger the download
  doc.save(`Invoice_Order_${data.orderNumber}.pdf`);
}


// import jsPDF from "jspdf";
// import 'jspdf-autotable'
// import {v4 as uuidv4} from 'uuid'

// export const generateInvoice=(data)=>{
//     const doc=new jsPDF();

//     //title
//     doc.setFontSize(20)
//     doc.text('Invoice',20,20)

//      // Header information (Seller and Buyer info)
//   doc.setFontSize(12);
//   doc.text("Sold By: ELARA Private Limited", 20, 30);
//   doc.text("Ship-from Address: NDR warehouse, Coimbatore, Tamil Nadu", 20, 50);
//     //order number
//     doc.setFontSize(12)
//     doc.text(`Order ID: ${data.orderNumber}`,150,30)
//     doc.text(`Order Date: ${new Date(data.orderDate).toLocaleDateString()}`,150,40)
//     doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 150, 50);
//     //billing anf shi info
//     doc.text(`Bill to`,20,60)
//     doc.text(`${data.shippingAddress.fullName}`,20, 70)
//     doc.text(`${data.shippingAddress.addressLine}` ,20, 80)
//     doc.text("Phone: xxxxxxxxxx", 20, 100);

//     doc.text("Ship To", 150, 60);
//     doc.text(`${data.shippingAddress.fullName}`, 150, 70);
//     doc.text(`${data.shippingAddress.addressLine}`, 150, 80);
//     doc.text("Phone: xxxxxxxxxx", 150, 100);

//     // Invoice Number
//   doc.text(`Invoice Number # FAB${uuidv4()}`, 150, 120);

//   //product info table
//   const items=data.items.filter((item)=>item.status=='Delivered' && item.PaymentStatus=='Paid').map((item)=>([
//     item.productId.name,
//     item.size,
//     item.quantity,
//     `₹${item.price}`,
//     `₹${item.price * item.quantity}`
//   ]))

//   doc.autoTable({
//     head: [['Product', 'Size', 'Quantity', 'Price', 'Total']],
//     body: items,
//     startY: 100,
//   });

//    // Add summary
//    const summaryY = doc.lastAutoTable.finalY + 10;
//    doc.text(`Subtotal: ₹${data.totalMRP}`, 20, summaryY);
//    doc.text(`Discount: ₹${data.totalDiscount}`, 20, summaryY + 10);
//    doc.text(`Shipping Fee: ₹${data.shippingFee}`, 20, summaryY + 20);
//    if (data.couponDiscount !== 0) {
//     doc.text(`Coupon (${data.couponCode}): -₹${data.couponDiscount}`, 20, summaryY + 30);
//   }
//   doc.text(`Total: ₹${data.totalAmount}`, 20, summaryY + 40);

//   // Trigger the download
//   doc.save(`Invoice_Order_${data.orderNumber}.pdf`);

// }