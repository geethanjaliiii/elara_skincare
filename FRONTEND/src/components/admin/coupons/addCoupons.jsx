"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { validationSchema } from "@/utils/validation/couponValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAddCouponMutation } from "@/hooks/admin/customHooks";


export default function AddCoupon() {
  const {mutate:addCoupon}=useAddCouponMutation();
  const [expiryDate, setExpiryDate] = useState(new Date());
  const navigate = useNavigate();
  const initialValues = {
    code: "",
    description: "",
    discountType: "percentage",
    discountPercentage: "",
    discountValue: "",
    minPurchaseOrder: 0,
    maxDiscountAmount: "",
    usageLimit: "",
    maxUsagePerUser: "",
    expiryDate: new Date(),
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    const submitData = {
      ...values,
      discountPercentage:
        values.discountType === "percentage"
          ? values.discountPercentage
          : undefined,
      discountValue:
        values.discountType == "flat" ? values.discountValue : undefined,
      maxDiscountAmount:
        values.discountType == "percentage"
          ? values.maxDiscountAmount
          : undefined,
    };

    addCoupon(submitData, {
      onSuccess: () => {
        toast.success("Coupon added successfully");
        navigate("/admin/dashboard/coupons");
      },
      onError: (error) => {
        console.error("Error adding coupons", error);
        const errorMessage =
          error?.response?.data?.message || "Coupon not added.";
        toast.error(errorMessage);
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="container mx-auto ">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">Add New Coupon</h1>
      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
              <Form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Field
                    name="code"
                    as={Input}
                    id="code"
                    placeholder="Enter coupon code"
                    onChange={(e) =>
                      setFieldValue("code", e.target.value.toUpperCase())
                    }
                  />
                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field
                    name="description"
                    as={Textarea}
                    id="description"
                    placeholder="Enter coupon description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <Field name="discountType">
                    {({ field }) => (
                      <Select
                        onValueChange={(value) =>
                          setFieldValue("discountType", value)
                        }
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="discountType"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {values.discountType == "percentage" ? (
                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage">
                      Discount Percentage
                    </Label>
                    <Field
                      name="discountPercentage"
                      as={Input}
                      type="number"
                      id="discountPercentage"
                      placeholder="50%"
                      required
                      min="1"
                      max="100"
                    />
                    <ErrorMessage
                      name="discountPercentage"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value</Label>
                    <Field
                      name="discountValue"
                      as={Input}
                      type="number"
                      id="discountValue"
                      placeholder="Enter discount value"
                      required
                      min="1"
                    />
                    <ErrorMessage
                      name="discountValue"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="minPurchaseOrder">
                    Minimum Purchase Order
                  </Label>
                  <Field
                    name="minPurchaseOrder"
                    as={Input}
                    type="number"
                    id="minPurchaseOrder"
                    placeholder="Enter minimum purchase order"
                    min="0"
                  />
                  <ErrorMessage
                    name="minPurchaseOrder"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {values.discountType === "percentage" && (
                  <div className="space-y-2">
                    <Label htmlFor="maxDiscountAmount">
                      Maximum Discount Amount
                    </Label>
                    <Field
                      name="maxDiscountAmount"
                      as={Input}
                      type="number"
                      id="maxDiscountAmount"
                      placeholder="Enter maximum discount amount"
                      min="0"
                    />
                    <ErrorMessage
                      name="maxDiscountAmount"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Field
                    name="usageLimit"
                    as={Input}
                    type="number"
                    id="usageLimit"
                    placeholder="Enter usage limit"
                  />
                  <ErrorMessage
                    name="usageLimit"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxUsagePerUser">
                    Maximum usage per user
                  </Label>
                  <Field
                    name="maxUsagePerUser"
                    as={Input}
                    type="number"
                    id="maxUsagePerUser"
                    placeholder="Enter usage per user"
                  />
                  <ErrorMessage
                    name="maxUsagePerUser"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !expiryDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiryDate ? (
                          format(expiryDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expiryDate}
                        onSelect={(date) => {
                          setExpiryDate(date);
                          setFieldValue("expiryDate", date);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <ErrorMessage
                    name="expiryDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Add Coupon
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
