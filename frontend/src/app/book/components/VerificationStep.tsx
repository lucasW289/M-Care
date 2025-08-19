/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import jsQR from "jsqr";
import Image from "next/image";

import {
  ArrowLeft,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface UserDetails {
  name: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
}

interface SelectedSlot {
  date: string;
  time: string;
}

interface VerificationStepProps {
  userDetails: UserDetails;
  bookingId: string;
  selectedSlot: SelectedSlot | null;
  paymentSlip: File | null;
  setPaymentSlip: (file: File | null) => void;
  verificationStatus: "pending" | "verified" | "failed" | null;
  setVerificationStatus: (
    status: "pending" | "verified" | "failed" | null
  ) => void;
  getTotalAmount: () => number;
  onBack: () => void;
}

export default function VerificationStep({
  userDetails,
  bookingId,
  selectedSlot,
  paymentSlip,
  setPaymentSlip,
  verificationStatus,
  setVerificationStatus,
  getTotalAmount,
  onBack,
}: VerificationStepProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPaymentSlip(file);
  };

  const handleVerifyPayment = async () => {
    if (!paymentSlip) return;

    setVerificationStatus("pending");
    const totalAmount = getTotalAmount();

    try {
      const img = await createImageBitmap(paymentSlip);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (!code) {
        setVerificationStatus("failed");
        alert("No QR code found in the image");
        return;
      }
      const qrData = code.data;

      const res = await fetch("http://localhost:3007/verify-slip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingID: bookingId,
          refNbr: qrData,
          amount: totalAmount,
        }),
      });
      const result = await res.json();

      if (result.status !== "queued") {
        setVerificationStatus(result.status);
        return;
      }

      const pollInterval = 2000;
      const maxAttempts = 30;
      let attempts = 0;

      const poll = async () => {
        attempts++;
        const statusRes = await fetch(
          `http://localhost:3007/verify-slip/status/${bookingId}`
        );
        const statusData = await statusRes.json();

        if (
          statusData.status === "verified" ||
          statusData.status === "failed"
        ) {
          setVerificationStatus(statusData.status);
        } else if (attempts < maxAttempts) {
          setTimeout(poll, pollInterval);
        } else {
          setVerificationStatus("failed");
        }
      };

      poll();
    } catch (err) {
      console.error("Verification error:", err);
      setVerificationStatus("failed");
    }
  };

  const formatFullDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-5 leading-tight">
          Upload Payment Slip
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-1 sm:px-0">
          Please upload your payment slip for verification
        </p>
      </div>

      {/* Upload Step */}
      {verificationStatus === null && (
        <Card className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
            Upload Payment Slip
          </h3>

          <div className="max-w-full mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 hover:border-rose-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="payment-slip"
              />
              <label
                htmlFor="payment-slip"
                className="cursor-pointer select-none"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                  <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">
                    Click to upload payment slip
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </label>
            </div>

            {paymentSlip && (
              <div className="mt-4 sm:mt-5 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{paymentSlip.name}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleVerifyPayment}
              disabled={!paymentSlip}
              className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center"
            >
              Verify Payment
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Pending */}
      {verificationStatus === "pending" && (
        <Card className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-pulse">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
            Verifying Payment...
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Please wait while we verify your payment slip
          </p>
        </Card>
      )}

      {/* Verified */}
      {verificationStatus === "verified" && (
        <Card className="bg-white border-2 border-green-200 rounded-2xl p-4 sm:p-6 shadow-lg text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-3 sm:mb-4">
            Booking Confirmed Successfully!
          </h3>
          <p className="text-green-700 text-sm sm:text-base mb-4 sm:mb-5 px-1 sm:px-0">
            Your appointment has been confirmed. Confirmation sent to{" "}
            {userDetails.email}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
              <div className="text-xs sm:text-sm text-green-800 mb-1">
                Booking Reference
              </div>
              <div className="text-lg sm:text-xl font-black text-green-900 truncate">
                {bookingId}
              </div>
            </div>
            {selectedSlot && (
              <div className="bg-green-50 p-3 sm:p-4 rounded-xl border border-green-200">
                <div className="text-xs sm:text-sm text-green-800 mb-1">
                  Appointment
                </div>
                <div className="text-base sm:text-lg font-bold text-green-900">
                  {formatFullDate(selectedSlot.date)}
                </div>
                <div className="text-base sm:text-lg font-bold text-green-900">
                  {selectedSlot.time}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Failed */}
      {verificationStatus === "failed" && (
        <Card className="bg-white border-2 border-red-200 rounded-2xl p-4 sm:p-6 shadow-lg text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-red-900 mb-3 sm:mb-4">
            Payment Verification Failed
          </h3>
          <p className="text-red-700 text-sm sm:text-base mb-4 sm:mb-5 px-1 sm:px-0">
            We couldn't verify your payment. It may either be invalid or already
            used.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xs mx-auto">
            <Button
              className="border-2 border-red-300 text-red-700 hover:bg-red-50 bg-transparent mb-2 sm:mb-0 flex items-center justify-center"
              onClick={() => {
                setPaymentSlip(null);
                setVerificationStatus(null);
              }}
            >
              <Upload className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button className="border-2 border-red-300 text-red-700 hover:bg-red-50 bg-transparent flex items-center justify-center">
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
          </div>
        </Card>
      )}

      {verificationStatus !== "verified" && verificationStatus !== null && (
        <div className="flex justify-center pt-6 sm:pt-8">
          <Button
            onClick={onBack}
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-transparent flex items-center justify-center max-w-xs mx-auto text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to Payment
          </Button>
        </div>
      )}
    </div>
  );
}
