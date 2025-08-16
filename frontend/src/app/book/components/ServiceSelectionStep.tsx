/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ServicesList from "./ServicesList";
import UserDetailsForm from "./UserDetailsForm";
import SelectedServicesSidebar from "./SelectedServicesSidebar";

interface UserDetails {
  name: string;
  passportNumber: string;
  phoneNumber: string;
  email: string;
}

interface ServiceSelectionStepProps {
  services: any[];
  selectedServices: any[];
  setSelectedServices: (services: any[]) => void;
  userDetails: UserDetails;
  setUserDetails: (details: UserDetails) => void;
  onNext: () => void;
  isValid: boolean;
  getTotalAmount: () => number;
}

export default function ServiceSelectionStep({
  services,
  selectedServices,
  setSelectedServices,
  userDetails,
  setUserDetails,
  onNext,
  isValid,
  getTotalAmount,
}: ServiceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleServiceToggle = (service: any) => {
    setSelectedServices(
      selectedServices.find((s) => s.title === service.title)
        ? selectedServices.filter((s) => s.title !== service.title)
        : [...selectedServices, { ...service, quantity: 1 }]
    );
  };

  const updateQuantity = (serviceTitle: string, change: number) => {
    setSelectedServices(
      selectedServices.map((service) =>
        service.title === serviceTitle
          ? { ...service, quantity: Math.max(1, service.quantity + change) }
          : service
      )
    );
  };

  const removeService = (serviceTitle: string) => {
    setSelectedServices(
      selectedServices.filter((s) => s.title !== serviceTitle)
    );
  };

  const handleUserDetailsChange = (field: keyof UserDetails, value: string) => {
    setUserDetails({ ...userDetails, [field]: value });
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left Column: Services List */}
      <div className="lg:col-span-2 space-y-8">
        <ServicesList
          services={filteredServices}
          selectedServices={selectedServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onServiceToggle={handleServiceToggle}
        />
      </div>

      {/* Right Column: User Form + Selected Services */}
      <div className="lg:col-span-1 space-y-6">
        {/* User Details Form - Now at the top */}
        <UserDetailsForm
          userDetails={userDetails}
          onUserDetailsChange={handleUserDetailsChange}
        />

        {/* Selected Services Sidebar - Now below the form */}
        <SelectedServicesSidebar
          selectedServices={selectedServices}
          onUpdateQuantity={updateQuantity}
          onRemoveService={removeService}
          getTotalAmount={getTotalAmount}
          onNext={onNext}
          isValid={isValid}
          buttonText="Continue to Time Selection"
        />
      </div>
    </div>
  );
}
