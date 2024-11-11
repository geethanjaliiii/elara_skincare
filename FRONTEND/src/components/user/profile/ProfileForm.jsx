

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Lock } from "lucide-react";
import { axiosInstance } from '@/config/axiosConfig';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '@/store/slices/userSlice';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ChangePasswordModal from './ChangePasswordModal';

const validationSchema = Yup.object({
  name: Yup.string().required("Full name is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

const ProfileForm = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const dispatch = useDispatch();

  
  useEffect(() => {
    // Reset editing state when user changes
    setIsEditing(false);
  }, [user]);

 
  const handleSubmit = async (values) => {
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
  };

  return (
    <div>
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
              validationSchema={validationSchema}
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
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        userId={user._id}
      />
    </div>
  );
};

export default ProfileForm;
