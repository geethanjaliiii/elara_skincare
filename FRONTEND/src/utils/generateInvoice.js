
import jsPDF from "jspdf";
import "jspdf-autotable";
import { v4 as uuidv4 } from "uuid";

export const generateInvoice = (data, item) => {
  const doc = new jsPDF();

  // Title: Tax Invoice
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Tax Invoice", 20, 20);

  // Seller Information
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Sold By: ELARA Skincare Private Limited,", 20, 30);
  doc.text(
    "Ship-from Address: NDR warehousing private ltd, SF No. 525, 526, 529-333, Kalamssery , Pipeline Road,",
    20,
    35
  );
  doc.text("Kochi: Kerala, India - 641032. IN-TN.", 20, 40);
  doc.text("GSTIN - 33AAJCA4872D1ZV", 20, 45);

  // Order and Invoice Information
  doc.setFont("helvetica", "bold");
  doc.text(`Invoice Number: FAB${uuidv4().slice(0, 8)}`, 150, 30);

  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${data.orderNumber}`, 20, 55);
  doc.text(`Order Date: ${new Date(data.orderDate).toLocaleDateString()}`, 20, 60);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`PAN: AABCJ9421C`, 20, 70);

  // Bill To and Ship To
  doc.setFont("helvetica", "bold");
  doc.text("Bill To", 20, 80);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    `${data.customerName}\n${data.shippingAddress.addressLine}, ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}`,
    20,
    85
  );
  doc.text("Phone: xxxxxxxxxx", 20, 100);

  doc.setFont("helvetica", "bold");
  doc.text("Ship To", 120, 80);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${data.shippingAddress.fullName}\n${data.shippingAddress.addressLine}, ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}`,
    120,
    85
  );
  doc.text("Phone: xxxxxxxxxx", 120, 100);

  // Note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text(
    "*Keep this invoice and manufacturer box for warranty purposes.",
    20,
    110
  );

  // Product Table
  const itemData = [
    item.productId.name,
    item.quantity,
    `${item.price.toFixed(2)}`,
    `${item.totalMRP.toFixed(2)}`,
    `${-(item.offerDiscountPrice + item.couponDiscountPrice).toFixed(2)}`,
    `${((item.totalMRP / data.totalMRP) * data.tax).toFixed(2)}`,
    `${item.totalPrice.toFixed(2)}`,
  ];

  doc.autoTable({
    head: [
      [
        "Product",
        "Qty",
        "Unit Price",
        "Gross Amount",
        "Discount/Coupons",
        "Tax",
        "Total",
      ],
    ],
    body: [itemData],
    startY: 120,
    styles: {
      fontSize: 8,
      halign: "center",
      valign: "middle",
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 40, halign: "left" },
      1: { cellWidth: 15, halign: "center" },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 25, halign: "right" },
      4: { cellWidth: 25, halign: "right" },
      5: { cellWidth: 25, halign: "right" },
      6: { cellWidth: 25, halign: "right" },
    },
    theme: "grid",
    margin: { left: 20, right: 20 },
  });

  // Shipping and Handling Charges
  const shippingY = doc.lastAutoTable.finalY + 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Shipping And Handling Charges", 20, shippingY);
  doc.text(
    `${(data.shippingFee * (item.totalMRP / data.totalMRP)).toFixed(2)}`,
    180,
    shippingY,
    { align: "right" }
  );

  /// Grand Total
  const grandTotalY = shippingY + 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Grand Total: ${item.totalPrice.toFixed(2)}`, 20, grandTotalY);

  // Footer
  const footerY = grandTotalY + 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ELARA Skincare Private Limited", 20, footerY);

  // Save the Invoice
  doc.save(`Invoice_Order_${data.orderNumber}.pdf`);
};
