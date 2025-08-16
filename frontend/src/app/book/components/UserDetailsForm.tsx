/* eslint-disable react/no-unescaped-entities */
"use client";

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
  return (
    <Card className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Your Information</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={userDetails.name}
            onChange={(e) => onUserDetailsChange("name", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white shadow-sm text-sm"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Passport Number *
          </label>
          <input
            type="text"
            value={userDetails.passportNumber}
            onChange={(e) =>
              onUserDetailsChange("passportNumber", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white shadow-sm text-sm"
            placeholder="Enter passport number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={userDetails.phoneNumber}
            onChange={(e) => onUserDetailsChange("phoneNumber", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white shadow-sm text-sm"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={userDetails.email}
            onChange={(e) => onUserDetailsChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white shadow-sm text-sm"
            placeholder="Enter email address"
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-2 text-xs text-blue-800">
          <Shield className="w-3 h-3 text-blue-600" />
          <span>
            We'll send your booking confirmation to this email address
          </span>
        </div>
      </div>
    </Card>
  );
}
