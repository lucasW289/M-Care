/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { User, Shield } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface UserDetails {
  name: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
}

interface UserDetailsFormProps {
  userDetails: UserDetails;
  onUserDetailsChange: (field: keyof UserDetails, value: string) => void;
}

export default function UserDetailsForm({
  userDetails,
  onUserDetailsChange,
}: UserDetailsFormProps) {
  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const validateField = (field: keyof UserDetails, value: string) => {
    let error = "";
    if (!value.trim()) error = "This field is required";
    else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Invalid email address";
    } else if (field === "phoneNumber") {
      const phoneRegex = /^[0-9]{7,15}$/;
      if (!phoneRegex.test(value)) error = "Invalid phone number";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <Card
      className="bg-white  border-2 border-gray-100 
    rounded-2xl p-4 sm:p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl flex items-center justify-center">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <h3
          className="text-lg sm:text-xl font-bold text-gray-900 
        "
        >
          Your Information
        </h3>
      </div>

      {/* Form */}
      <div className="space-y-3 sm:space-y-4">
        {(["name", "passportNumber", "phoneNumber", "email"] as const).map(
          (field) => (
            <div key={field}>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700  mb-1">
                {field === "name"
                  ? "Full Name *"
                  : field === "passportNumber"
                  ? "Passport Number *"
                  : field === "phoneNumber"
                  ? "Phone Number *"
                  : "Email Address *"}
              </label>
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "phoneNumber"
                    ? "tel"
                    : "text"
                }
                value={userDetails[field]}
                onChange={(e) => {
                  onUserDetailsChange(field, e.target.value);
                  validateField(field, e.target.value);
                }}
                onBlur={(e) => validateField(field, e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-xl text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors[field]
                    ? "border-red-400  focus:ring-red-400 "
                    : "border-gray-200  focus:ring-pink-400 "
                } bg-white  text-gray-900 `}
                placeholder={
                  field === "name"
                    ? "Enter your full name"
                    : field === "passportNumber"
                    ? "Enter passport number"
                    : field === "phoneNumber"
                    ? "Enter phone number"
                    : "Enter email address"
                }
              />
              {errors[field] && (
                <p className="text-red-500  text-xs mt-1">{errors[field]}</p>
              )}
            </div>
          )
        )}
      </div>

      {/* Info Box */}
      <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-pink-50 rounded-xl border border-pink-200 ">
        <div className="flex items-center gap-1 text-xs sm:text-sm text-pink-800 ">
          <Shield className="w-3 h-3 text-pink-600 " />
          <span>
            We'll send your booking confirmation to this email address
          </span>
        </div>
      </div>
    </Card>
  );
}
