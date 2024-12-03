

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import { Button } from "@/components/ui/button";
import { Card, CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Lock,Copy,Share2,Edit } from "lucide-react";
import { axiosInstance } from '@/config/axiosConfig';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '@/store/slices/userSlice';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

import ChangePasswordModal from './ChangePasswordModal';
import profileValidationSchema from '@/utils/validation/profileValidationSchema';
import validateProfileForm from '@/utils/validation/validateProfile';

const ProfileForm = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const dispatch = useDispatch();

  
  useEffect(() => {
    // Reset editing state when user changes
    setIsEditing(false);
  }, [user]);

 
  const handleSubmit = async (values) => {
    console.log(values);
    if(validateProfileForm(values)){
      try {
        const response = await axiosInstance.put(`/api/users/profile/${user._id}`, values); // Pass values directly
        console.log("Form submitted successfully:", values);
        console.log("Updated user", response.data.updatedUser);
        dispatch(setUserDetails(response.data.updatedUser));
        toast.success("Profile updated.");
        setIsEditing(false); // Exit edit mode after save
      } catch (error) {
        toast.error("Profile updation failed. Please try again.");
        console.log("Error updating user", error);
      }
    }else{
      toast.error("Please check the required fields.")
    }
    
  };

  return (
    <div className="space-y-6 mx-auto">
    <Toaster />
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">My Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{ 
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || ''
          }}
          enableReinitialize
          validationSchema={profileValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleSubmit }) => (
            <Form className="space-y-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center rounded-md border bg-muted/50 px-3 py-1">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      readOnly={!isEditing}
                      onChange={handleChange}
                      value={values.name}
                    />
                  </div>
                  <ErrorMessage name="name" component="p" className="text-red-500 text-xs" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center rounded-md border bg-muted/50 px-3 py-1">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      readOnly={!isEditing}
                      onChange={handleChange}
                      value={values.phone}
                    />
                  </div>
                  <ErrorMessage name="phone" component="p" className="text-red-500 text-xs" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center rounded-md border bg-muted/50 px-3 py-1">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      className="border-0 bg-transparent p-0 focus-visible:ring-0"
                      readOnly={true}
                      onChange={handleChange}
                      value={values.email}
                    />
                  </div>
                  <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSubmit();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="bg-[#8B4513] hover:bg-[#6F3709]"
                >
                  {isEditing ? (
                    <>Save</>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  variant="outline"
                >
                  <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>

    

    <ChangePasswordModal
      isOpen={isChangePasswordModalOpen}
      onClose={() => setIsChangePasswordModalOpen(false)}
      userId={user._id}
    />
  </div>
  );
};

export default ProfileForm;
{/* <div>
<Card>
  <Toaster />
  <CardContent className="p-6">
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary">My Profile</h2>
      <p className="text-sm text-muted-foreground">Manage your profile information</p>

      <Formik
        initialValues={{ 
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || ''
        }}
        enableReinitialize
        validationSchema={profileValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <Form className="space-y-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <div className="flex items-center rounded-md border bg-muted/50 px-4 py-2">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <Field
                  as={Input}
                  name="name"
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  readOnly={!isEditing}
                  onChange={handleChange}
                  value={values.name}
                />
              </div>
              <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
            </div>

            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <div className="flex items-center rounded-md border bg-muted/50 px-4 py-2">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <Field
                  as={Input}
                  name="phone"
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  readOnly={!isEditing}
                  onChange={handleChange}
                  value={values.phone}
                />
              </div>
              <ErrorMessage name="phone" component="p" className="text-red-500 text-sm" />
            </div>

            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="flex items-center rounded-md border bg-muted/50 px-4 py-2">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <Field
                  as={Input}
                  name="email"
                  className="border-0 bg-transparent p-0 focus-visible:ring-0"
                  readOnly={true}
                  onChange={handleChange}
                  value={values.email}
                />
              </div>
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
            </div>
            <Button
              className="w-full bg-[#8B4513] hover:bg-[#6F3709]"
              type="button" // Set type to button to prevent implicit submit
              onClick={() => {
                if (isEditing) {
                  handleSubmit(values); // Call handleSubmit on save
                } else {
                  setIsEditing(true); // Enter edit mode
                }
              }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            <Button
              className="w-full bg-[#8B4513] hover:bg-[#6F3709]"
              type="button"
              onClick={() => setIsChangePasswordModalOpen(true)}
            >
              <Lock className="mr-2 h-4 w-4" /> Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle className="text-2xl font-semibold text-primary">Refer and Earn</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Your Referral Code</Label>
            <p className="text-2xl font-bold text-primary">{user.referralCode || 'YOURCODE'}</p>
          </div>
          <Button
            onClick={copyReferralCode}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Code
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">How it works:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Share your referral code with friends</li>
          <li>When they sign up using your code, they get ₹50 in their wallet</li>
          <li>You earn ₹100 for each successful referral</li>
        </ul>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">Total Referrals</p>
          <p className="text-2xl font-bold text-primary">{user.totalReferrals || 0}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Earnings</p>
          <p className="text-2xl font-bold text-primary">₹{user.referralEarnings || 0}</p>
        </div>
      </div>

      <Button className="w-full bg-[#8B4513] hover:bg-[#6F3709]">
        <Share2 className="mr-2 h-4 w-4" /> Share Your Referral Code
      </Button>
    </div>
  </CardContent>
</Card>
<ChangePasswordModal
  isOpen={isChangePasswordModalOpen}
  onClose={() => setIsChangePasswordModalOpen(false)}
  userId={user._id}
/>
</div> */}