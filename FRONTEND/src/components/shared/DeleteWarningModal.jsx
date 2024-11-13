// DeleteWarningModal.js
import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "./Modal";

export function DeleteWarningModal({ isOpen, onClose, onConfirm, statement }) {
  if(!isOpen){
    return null
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Are you sure?</h2>
          <p className="text-sm text-gray-600 mb-4">
            Do you really want to {statement}
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="destructive" onClick={onConfirm}>
              Yes
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
