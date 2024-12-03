import React, { useState ,useEffect} from "react";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

export function ReturnRequestModal({ isOpen, onClose, onSubmit, orderId, itemId }) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
      setComment("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason) {
      toast.error("Please select a reason for the return.");
      return;
    }

    const requestData = {
      orderId,
      itemId,
      reason,
      comment,
    };

    onSubmit(requestData); // Pass the form data to the parent component
    onClose(); // Close the modal after submission
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <Toaster/>
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-4 text-center">Return Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Reason for Return</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="" disabled>
                Select a reason
              </option>
              <option value="Damaged item">Damaged item</option>
              <option value="Wrong item delivered">Wrong item delivered</option>
              <option value="Not satisfied with the product">Not satisfied with the product</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Additional Comments (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full border rounded-md p-2"
              placeholder="Provide any additional details here..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
