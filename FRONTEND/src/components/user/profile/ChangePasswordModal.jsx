import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { axiosInstance } from '@/config/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
import validatePassword from '@/utils/validation/passwordValidation';


export default function ChangePasswordModal({ isOpen, onClose, userId }) {
  const [step, setStep] = useState('verify');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 'verify') {
      try {
        await axiosInstance.post(`/api/users/verify-password/${userId}`, { currentPassword });
        setStep('change');
      } catch (error) {
       
        console.log("error verifying",error);
        
        toast.error("Current password is incorrect. Please try again.");
      }
    } else {
      if(!validatePassword(newPassword)){
        toast.error("Please enter a valid password")
      return
      }
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      try {
        await axiosInstance.post(`/api/users/change-password/${userId}`, {
          currentPassword,
          newPassword
        });
        toast.success("Password changed successfully");
        onClose();
        setStep('verify')
        setConfirmPassword("")
        setCurrentPassword("")
        setNewPassword("")
      } catch (error) {
        const errorMessage=error?.response?.data?.message||"Failed to change password. Please try again."
        toast.error(errorMessage);
      }
    }
  };
const handleClose=()=>{
  setConfirmPassword("")
  setCurrentPassword("")
  setNewPassword("")
  setStep('verify')
  onClose();
}
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Toaster/>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 'verify' ? (
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={()=>{
              setConfirmPassword("")
              setCurrentPassword("")
              setNewPassword("")
              setStep('verify')
              onClose();

            }}>Cancel</Button>
            <Button type="submit" className="bg-[#8B4513] hover:bg-[#6F3709]">
              {step === 'verify' ? 'Verify' : 'Change Password'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}