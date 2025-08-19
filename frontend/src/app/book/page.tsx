/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BookingHeader from "./components/BookingHeader";
import BookingStepper from "./components/BookingStepper";
import ServiceSelectionStep from "./components/ServiceSelectionStep";
import TimeSlotSelectionStep from "./components/TimeSlotSelectionStep";
import PaymentStep from "./components/PaymentStep";
import VerificationStep from "./components/VerificationStep";
import { useServices } from "@/context/ServicesContext"; // <- use the context hook

const steps = [
  {
    id: 1,
    title: "Service & Details",
    description: "Choose services and enter your information",
  },
  {
    id: 2,
    title: "Select Time Slot",
    description: "Choose your preferred appointment time",
  },
  { id: 3, title: "Payment", description: "Scan QR code to pay" },
  {
    id: 4,
    title: "Verification",
    description: "Upload payment slip for verification",
  },
];

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

export default function BookingPage() {
  const { services, loading, error } = useServices(); // <- get services from context

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    passportNumber: "",
    phoneNumber: "",
    email: "",
  });
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [paymentSlip, setPaymentSlip] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "verified" | "failed" | null
  >(null);
  const [bookingId] = useState(() => `BK${Date.now().toString().slice(-6)}`);

  const handleNext = () =>
    currentStep < steps.length && setCurrentStep(currentStep + 1);
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const getTotalAmount = () =>
    selectedServices.reduce(
      (total, service) => total + service.price * service.quantity,
      0
    );

  const isStep1Valid = () =>
    selectedServices.length > 0 &&
    userDetails.name.trim() !== "" &&
    userDetails.passportNumber.trim() !== "" &&
    userDetails.phoneNumber.trim() !== "" &&
    userDetails.email.trim() !== "";

  const isStep2Valid = () => selectedSlot !== null;

  if (loading) return <p className="text-center mt-20">Loading services...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <BookingHeader />
        <BookingStepper steps={steps} currentStep={currentStep} />

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            {currentStep === 1 && (
              <ServiceSelectionStep
                services={services} // <- use context services
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                onNext={handleNext}
                isValid={isStep1Valid()}
                getTotalAmount={getTotalAmount}
              />
            )}

            {currentStep === 2 && (
              <TimeSlotSelectionStep
                selectedServices={selectedServices}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                onNext={handleNext}
                onBack={handleBack}
                isValid={isStep2Valid()}
                getTotalAmount={getTotalAmount}
              />
            )}

            {currentStep === 3 && (
              <PaymentStep
                selectedServices={selectedServices}
                selectedSlot={selectedSlot}
                bookingId={bookingId}
                userDetails={userDetails} // <-- added
                onNext={handleNext}
                onBack={handleBack}
                getTotalAmount={getTotalAmount}
              />
            )}

            {currentStep === 4 && (
              <VerificationStep
                userDetails={userDetails}
                bookingId={bookingId}
                selectedSlot={selectedSlot}
                paymentSlip={paymentSlip}
                setPaymentSlip={setPaymentSlip}
                verificationStatus={verificationStatus}
                setVerificationStatus={setVerificationStatus}
                onBack={handleBack}
                getTotalAmount={getTotalAmount}
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
