/* eslint-disable react/no-unescaped-entities */
// /Users/aungphyolinn/Desktop/MCare/frontend/src/app/book/components/VerificationStep.tsx
"use client";

import type React from "react";
import jsQR from "jsqr";

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
      // Convert image to ImageData
      const img = await createImageBitmap(paymentSlip);
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Decode QR
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (!code) {
        setVerificationStatus("failed");
        alert("No QR code found in the image");
        return;
      }
      const qrData = code.data;

      // Enqueue verification job
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

      // Polling
      const pollInterval = 2000; // 2s
      const maxAttempts = 30; // total ~1 min
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
          setVerificationStatus("failed"); // timeout
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
          Upload Payment Slip
        </h2>
        <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
          Please upload your payment slip for verification
        </p>
      </div>

      {/* Upload Step */}
      {verificationStatus === null && (
        <Card className="bg-white border-2 border-gray-100 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
            Upload Payment Slip
          </h3>

          <div className="max-w-md mx-auto">
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 sm:p-8 hover:border-rose-400 transition-colors">
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
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
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
              <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 text-green-800 text-sm sm:text-base">
                  <CheckCircle className="w-5 h-5" />
                  <span className="truncate">
                    File uploaded: {paymentSlip.name}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleVerifyPayment}
              disabled={!paymentSlip}
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl disabled:opacity-50"
            >
              Verify Payment
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      )}

      {/* Pending */}
      {verificationStatus === "pending" && (
        <Card className="bg-white border-2 border-gray-100 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-pulse">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
            Verifying Payment...
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Please wait while we verify your payment slip
          </p>
        </Card>
      )}

      {/* Success */}
      {verificationStatus === "verified" && (
        <Card className="bg-white border-2 border-green-200 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-green-900 mb-4 sm:mb-6">
            Booking Confirmed Successfully!
          </h3>
          <p className="text-green-700 text-base sm:text-lg mb-6 sm:mb-8 px-2 sm:px-0">
            Your appointment has been confirmed. We've sent a confirmation email
            to {userDetails.email}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-green-50 p-4 sm:p-6 rounded-2xl border border-green-200">
              <div className="text-sm sm:text-base text-green-800 mb-1 sm:mb-2">
                Booking Reference
              </div>
              <div className="text-xl sm:text-2xl font-black text-green-900 truncate">
                {bookingId}
              </div>
            </div>
            {selectedSlot && (
              <div className="bg-green-50 p-4 sm:p-6 rounded-2xl border border-green-200">
                <div className="text-sm sm:text-base text-green-800 mb-1 sm:mb-2">
                  Appointment
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-900">
                  {formatFullDate(selectedSlot.date)}
                </div>
                <div className="text-lg sm:text-xl font-bold text-green-900">
                  {selectedSlot.time}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Failed */}
      {verificationStatus === "failed" && (
        <Card className="bg-white border-2 border-red-200 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-red-900 mb-4 sm:mb-6">
            Payment Verification Failed
          </h3>
          <p className="text-red-700 text-base sm:text-lg mb-6 sm:mb-8 px-2 sm:px-0">
            We couldn't verify your payment. It may either be invalid or already
            used.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button
              className="border-2 border-red-300 text-red-700 hover:bg-red-50 bg-transparent mb-4 sm:mb-0 flex items-center justify-center"
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
        <div className="flex justify-center pt-8 sm:pt-12">
          <Button
            onClick={onBack}
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 sm:px-8 py-3 rounded-xl bg-transparent flex items-center justify-center max-w-xs mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Payment
          </Button>
        </div>
      )}
    </div>
  );
}
