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
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Services List */}
      <div className="lg:col-span-2 order-1">
        <ServicesList
          services={filteredServices}
          selectedServices={selectedServices}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onServiceToggle={handleServiceToggle}
        />
      </div>

      {/* User Details + Selected Services */}
      <div className="lg:col-span-1 flex flex-col gap-6 order-2 mt-6 lg:mt-0">
        {/* User Details Form */}
        <UserDetailsForm
          userDetails={userDetails}
          onUserDetailsChange={handleUserDetailsChange}
        />

        {/* Selected Services Sidebar */}
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
