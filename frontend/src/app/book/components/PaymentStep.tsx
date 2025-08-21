/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CreditCard, QrCode, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import QRCodeSVG from "./QRCodeSVG";
import Image from "next/image";
interface SelectedSlot {
  date: string;
  time: string;
}

interface UserDetails {
  name: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
}

interface PaymentStepProps {
  selectedServices: any[];
  selectedSlot: SelectedSlot | null;
  bookingId: string;
  userDetails: UserDetails;
  onNext: () => void;
  onBack: () => void;
  getTotalAmount: () => number;
}

export default function PaymentStep({
  selectedServices,
  selectedSlot,
  bookingId,
  userDetails,
  onNext,
  onBack,
  getTotalAmount,
}: PaymentStepProps) {
  const [loading, setLoading] = useState(false);

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalAmount = getTotalAmount();

  const handlePaymentConfirmation = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot before confirming payment.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        bookingId,
        refNumber: null, // initially null, updated later after slip upload
        timeSlot: selectedSlot,
        selectedServices: selectedServices.map((s) => ({
          serviceId: s._id, // <-- make sure serviceId is sent correctly
          name: s.title,
          price: s.price,
        })),
        amount: totalAmount,
        userDetails,
      };
      console.log(payload);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      onNext();
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert(
        "Something went wrong while saving your appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6">
          Scan PromptPay QR Code to Pay
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Use your mobile banking app to scan the QR code below and complete
          your payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Payment Summary */}
        <Card className="bg-white border-2 border-gray-100 rounded-3xl p-4 sm:p-6 shadow-2xl max-w-full w-full max-h-[500px] sm:max-h-[600px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-rose-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Payment Summary
            </h3>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-2xl">
              <div className="text-xs sm:text-sm text-gray-600 mb-1">
                Booking ID
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 break-all text-sm sm:text-base">
                  {bookingId}
                </span>
                <button
                  onClick={copyBookingId}
                  className="p-1 hover:bg-gray-200 rounded"
                  aria-label="Copy Booking ID"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {selectedSlot && (
              <div className="bg-indigo-50 p-3 sm:p-4 rounded-2xl border border-indigo-200">
                <div className="text-xs sm:text-sm text-indigo-600 font-medium mb-1">
                  Appointment Details
                </div>
                <div className="text-lg sm:text-xl font-bold text-indigo-900">
                  {formatFullDate(selectedSlot.date)}
                </div>
                <div className="text-lg sm:text-xl font-bold text-indigo-900">
                  {selectedSlot.time}
                </div>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              {selectedServices.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-1 sm:py-2"
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                      {service.title}
                    </div>
                    <div className="text-[9px] sm:text-xs text-gray-600">
                      Qty: {service.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 text-xs sm:text-sm">
                    ₿{(service.price * service.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-2 sm:pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  Total:
                </span>
                <span className="text-xl sm:text-2xl font-black text-rose-600">
                  ₿{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code */}
        <Card className="bg-white border-2 border-gray-100 rounded-3xl p-4 sm:p-6 shadow-xl text-center max-w-full w-full">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-rose-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-rose-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Scan to Pay
              </h3>

              <div className="flex justify-center mb-3">
                <Image
                  src="/ThaiQRPayment.svg"
                  alt="PromptPay"
                  width={120}
                  height={60}
                  className="w-20 sm:w-28 h-auto"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <QRCodeSVG amount={totalAmount} reference={bookingId} />
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 rounded-2xl">
              <div className="text-gray-600 mb-1 font-medium text-sm">
                Amount to Pay
              </div>
              <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">
                ₿{totalAmount.toLocaleString()}
              </div>
            </div>

            <Button
              onClick={handlePaymentConfirmation}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3 text-base sm:text-lg font-semibold rounded-xl"
            >
              {loading ? "Saving..." : "I've Made the Payment Already"}
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-8 sm:pt-12">
        <Button
          onClick={onBack}
          className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl bg-transparent flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Time Selection
        </Button>
      </div>
    </div>
  );
}
