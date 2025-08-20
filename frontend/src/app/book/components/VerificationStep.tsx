/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import jsQR from "jsqr";

import {
  ArrowLeft,
  Upload,
  Clock,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  Phone,
  FileImage,
  Sparkles,
  Shield,
  Zap,
  CreditCard,
  Calendar,
  User,
  Lock,
  Award,
  Verified,
  TrendingUp,
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
  const [qrError, setQrError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentSlip(file);
      setQrError(null);
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 50);
    }
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
        setQrError(
          "No QR code detected in the uploaded image. Please ensure the QR code is clearly visible and try again."
        );
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
      setQrError(
        "An unexpected error occurred during verification. Please try again."
      );
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
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64  rounded-full blur-2xl animate-float opacity-60"></div>
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64  rounded-full blur-2xl animate-float opacity-60"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-emerald-400/15 to-teal-600/15 rounded-full blur-xl animate-float opacity-40"
          style={{ animationDelay: "4s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/5 to-indigo-600/5 rounded-full blur-2xl animate-pulse"></div>

        <div className="absolute top-10 left-10 w-1 h-1 bg-pink-400 rounded-full animate-ping opacity-60"></div>
        <div
          className="absolute top-20 right-20 w-1 h-1 bg-indigo-500 rounded-full animate-ping opacity-40"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-50"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-10">
          <div className="relative inline-flex items-center justify-center mb-4 sm:mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-xl blur-lg opacity-30 animate-pulse-glow scale-110"></div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-xl blur-md opacity-40 animate-pulse-glow scale-105"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-md" />
              <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md">
                <Verified className="w-2 h-2 sm:w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-slate-900 via-pink-800 to-indigo-900 dark:from-slate-100 dark:via-pink-200 dark:to-indigo-100 bg-clip-text text-transparent mb-2 sm:mb-4 leading-tight tracking-tight">
            Payment Verification
          </h1>
        </div>

        {verificationStatus === null && (
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-10 transition-all duration-300"></div>
                <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-md flex items-center justify-center shadow-inner">
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mb-4 sm:mb-6 text-center tracking-tight">
                Upload Payment Slip
              </h2>

              <div className="max-w-md mx-auto">
                <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 sm:p-8 hover:border-pink-400 hover:bg-pink-50/30 dark:hover:bg-pink-900/10 transition-all duration-300 group/upload cursor-pointer overflow-hidden backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover/upload:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 border-2 border-pink-400 rounded-xl opacity-0 group-hover/upload:opacity-30 transition-opacity duration-300 animate-pulse"></div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="payment-slip"
                  />
                  <label
                    htmlFor="payment-slip"
                    className="cursor-pointer select-none block relative z-10"
                  >
                    <div className="text-center">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover/upload:bg-pink-100 dark:group-hover/upload:bg-pink-900/30 transition-all duration-300 shadow-md">
                        <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover/upload:text-pink-500 group-hover/upload:scale-110 transition-all duration-300" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-1 sm:mb-2">
                        Drop your payment slip here
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-4 sm:mb-6 font-medium">
                        or click to browse files
                      </p>
                      <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-semibold shadow-inner text-xs sm:text-sm">
                        <FileImage className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        PNG, JPG up to 10MB
                      </div>
                    </div>
                  </label>
                </div>

                {paymentSlip && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-lg animate-in slide-in-from-bottom-2 duration-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-green-100/50 dark:from-emerald-800/20 dark:to-green-800/20 animate-pulse"></div>
                    <div className="relative z-10 flex items-center gap-2 sm:gap-4">
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-800 rounded-lg flex items-center justify-center shadow-md">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-lg font-bold text-emerald-900 dark:text-emerald-100 truncate mb-1">
                          {paymentSlip.name}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs sm:text-sm">
                          Ready for verification
                        </p>
                        <div className="mt-1 w-full h-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {qrError && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl text-center shadow-md">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-800 rounded-md flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-red-700 dark:text-red-300 font-semibold text-xs sm:text-sm">
                      {qrError}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6 sm:mt-8">
                  <Button
                    onClick={onBack}
                    className="flex-1 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    Back to Payment
                  </Button>
                  <Button
                    onClick={handleVerifyPayment}
                    disabled={!paymentSlip}
                    className="flex-2 bg-gradient-to-r from-pink-600 via-indigo-600 to-purple-600 hover:from-pink-700 hover:via-indigo-700 hover:to-purple-700 text-white py-3 sm:py-4 text-sm sm:text-base font-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden min-w-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-shimmer"></div>
                    <Sparkles className="w-5 h-5 sm:w-6 h-6 mr-1 sm:mr-2 group-hover:animate-spin transition-transform duration-300" />
                    <span className="relative z-10">Verify Payment</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {verificationStatus === "pending" && (
          <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-orange-100/50 to-yellow-100/50 dark:from-amber-800/20 dark:via-orange-800/20 dark:to-yellow-800/20 animate-pulse"></div>
            <div
              className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative z-10">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <div className="absolute inset-2 bg-white dark:bg-amber-900 rounded-full flex items-center justify-center shadow-inner">
                  <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 dark:text-amber-400 animate-spin" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-amber-900 dark:text-amber-100 mb-2 sm:mb-4 tracking-tight">
                Verification in Progress
              </h2>
              <p className="text-sm sm:text-lg text-amber-700 dark:text-amber-300 leading-relaxed max-w-lg mx-auto mb-4 sm:mb-6 font-medium">
                Please wait while we securely analyzing your payment slip. This
                process typically completes within 30 seconds.
              </p>

              <div className="max-w-xs mx-auto">
                <div className="h-1.5 sm:h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden shadow-inner mb-1 sm:mb-2">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500 rounded-full animate-pulse shadow-md"></div>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-amber-600 dark:text-amber-400 font-bold">
                  <span>Processing...</span>
                  <span>Validating...</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-6 sm:mt-8">
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-200/50 dark:border-amber-700/50 shadow-md text-xs sm:text-sm">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-md flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-2.5 h-2.5 sm:w-3 h-3 text-white" />
                  </div>
                  <span className="text-amber-700 dark:text-amber-200 font-semibold">
                    QR Detected
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/80 dark:bg-amber-900/30 backdrop-blur-sm rounded-lg border border-amber-200/50 dark:border-amber-700/50 shadow-md text-xs sm:text-sm">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md flex items-center justify-center animate-spin">
                    <Clock className="w-2.5 h-2.5 sm:w-3 h-3 text-white" />
                  </div>
                  <span className="text-amber-700 dark:text-amber-200 font-semibold">
                    Verifying...
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {verificationStatus === "verified" && (
          <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100/30 via-green-100/30 to-teal-100/30 dark:from-emerald-800/10 dark:via-green-800/10 dark:to-teal-800/10"></div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-8 left-8 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60"></div>
              <div
                className="absolute top-12 right-12 w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce opacity-70"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce opacity-50"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute bottom-8 right-8 w-2 h-2 bg-emerald-500 rounded-full animate-bounce opacity-60"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-800 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <div className="absolute inset-2 bg-white dark:bg-emerald-900 rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 dark:from-emerald-100 dark:via-green-100 dark:to-teal-100 bg-clip-text text-transparent mb-2 sm:mb-4 tracking-tight">
                Booking Confirmed!
              </h2>
              <p className="text-sm sm:text-lg text-emerald-700 dark:text-emerald-300 mb-4 sm:mb-6 leading-relaxed max-w-xl mx-auto font-medium">
                🎉 Outstanding! Your appointment has been successfully
                confirmed. A comprehensive confirmation email has been sent to{" "}
                <span className="font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-800/30 px-1 py-0.5 rounded-md">
                  {userDetails.email}
                </span>
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 max-w-4xl mx-auto">
                <div className="bg-white/90 dark:bg-emerald-900/30 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-md flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-1 font-bold uppercase tracking-wider">
                    Booking Reference
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-900 dark:text-emerald-100 break-all leading-tight">
                    {bookingId}
                  </div>
                </div>

                {selectedSlot && (
                  <div className="bg-white/90 dark:bg-emerald-900/30 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-400 to-indigo-500 rounded-md flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-1 font-bold uppercase tracking-wider">
                      Appointment Date
                    </div>
                    <div className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-100 leading-tight mb-1">
                      {formatFullDate(selectedSlot.date)}
                    </div>
                    <div className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-100">
                      {selectedSlot.time}
                    </div>
                  </div>
                )}

                <div className="bg-white/90 dark:bg-emerald-900/30 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-md flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 mb-1 font-bold uppercase tracking-wider">
                    Customer Details
                  </div>
                  <div className="text-sm sm:text-base font-black text-emerald-900 dark:text-emerald-100 mb-1">
                    {userDetails.name}
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
                    {userDetails.phoneNumber}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {verificationStatus === "failed" && (
          <Card className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-100/30 via-pink-100/30 to-rose-100/30 dark:from-red-800/10 dark:via-pink-800/10 dark:to-rose-800/10"></div>

            <div className="relative z-10">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-800 dark:to-pink-800 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <div className="absolute inset-2 bg-white dark:bg-red-900 rounded-full flex items-center justify-center shadow-inner">
                  <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-red-900 dark:text-red-100 mb-2 sm:mb-4 tracking-tight">
                Verification Failed
              </h2>
              <p className="text-sm sm:text-lg text-red-700 dark:text-red-300 mb-4 sm:mb-6 leading-relaxed max-w-lg mx-auto font-medium">
                {qrError ||
                  "We encountered an issue verifying your payment slip. Please ensure the QR code is clearly visible and the payment details are correct."}
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-md mx-auto">
                <Button
                  className="flex-1 bg-white dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800/30 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
                  onClick={() => {
                    setPaymentSlip(null);
                    setVerificationStatus(null);
                    setQrError(null);
                  }}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Try Again
                </Button>
                <Button className="flex-1 bg-white dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-800/30 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  Get Help
                </Button>
              </div>
            </div>
          </Card>
        )}

        {verificationStatus !== "verified" && verificationStatus !== null && (
          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              onClick={onBack}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl flex items-center justify-center font-bold transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Back to Payment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
