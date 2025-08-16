/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SelectedSlot {
  date: string;
  time: string;
}

interface AppointmentSummaryProps {
  selectedSlot: SelectedSlot | null;
  selectedServices: any[];
  getTotalAmount: () => number;
  onNext: () => void;
  isValid: boolean;
  buttonText: string;
}

export default function AppointmentSummary({
  selectedSlot,
  selectedServices,
  getTotalAmount,
  onNext,
  isValid,
  buttonText,
}: AppointmentSummaryProps) {
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg sticky top-4 sm:top-6 w-full max-w-md mx-auto sm:mx-0">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-500 rounded-full flex items-center justify-center">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        Appointment Summary
      </h3>

      {!selectedSlot ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-base sm:text-lg">
            No time slot selected
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-1">
            Choose a date and time
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-indigo-200">
            <div className="text-sm sm:text-base text-indigo-600 font-medium mb-1 sm:mb-2">
              Selected Appointment
            </div>
            <div className="text-base sm:text-lg font-bold text-indigo-900 truncate">
              {formatFullDate(selectedSlot.date)}
            </div>
            <div className="text-base sm:text-lg font-bold text-indigo-900 truncate">
              {selectedSlot.time}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm sm:text-base font-semibold text-gray-700">
              Services:
            </div>
            {selectedServices.map((service, index) => (
              <div
                key={index}
                className="text-sm sm:text-base text-gray-600 truncate"
              >
                • {service.title} (x{service.quantity})
              </div>
            ))}
          </div>

          <div className="border-t pt-3 sm:pt-4">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Total:
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-600">
                ₿{getTotalAmount().toLocaleString()}
              </span>
            </div>

            <Button
              onClick={onNext}
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
