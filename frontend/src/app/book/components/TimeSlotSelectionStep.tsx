/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import AppointmentSummary from "./AppointmentSummary";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface SelectedSlot {
  date: string;
  time: string;
}

interface TimeSlotSelectionStepProps {
  selectedServices: any[];
  selectedSlot: SelectedSlot | null;
  setSelectedSlot: (slot: SelectedSlot | null) => void;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
  getTotalAmount: () => number;
}

export default function TimeSlotSelectionStep({
  selectedServices,
  selectedSlot,
  setSelectedSlot,
  onNext,
  onBack,
  isValid,
  getTotalAmount,
}: TimeSlotSelectionStepProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch time slots from backend
  const fetchTimeSlots = async (date: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3007/availability?date=${date}`
      );
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setTimeSlots(data.availability || []); // Correct field name from backend
    } catch (err) {
      console.error("Error fetching time slots:", err);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Generate next 14 days
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        isToday: i === 0,
      });
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Automatically fetch today’s slots on mount
  useEffect(() => {
    if (availableDates.length > 0) {
      const today = availableDates[0].value;
      setSelectedDate(today);
      fetchTimeSlots(today);
    }
  }, []);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset previous selection
    fetchTimeSlots(date);
  };

  // Handle time selection
  const handleTimeSlotSelect = (time: string) => {
    if (selectedDate) {
      setSelectedSlot({ date: selectedDate, time });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Select Date & Time
        </h2>
        <p className="text-sm text-gray-600">
          Choose your preferred appointment slot
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left side: Date + Time selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Date Selection */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-rose-600" />
              <h3 className="font-semibold text-gray-900">Select Date</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => handleDateSelect(date.value)}
                  className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedDate === date.value
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700"
                  }`}
                >
                  <div>{date.label}</div>
                  {date.isToday && (
                    <div className="text-xs text-rose-600">Today</div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Time Selection */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-rose-600" />
              <h3 className="font-semibold text-gray-900">Select Time</h3>
              {!selectedDate && (
                <span className="text-xs text-gray-500">
                  (Select a date first)
                </span>
              )}
            </div>
            {loading ? (
              <p className="text-sm text-gray-500">Loading slots...</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.length === 0 && selectedDate && (
                  <p className="col-span-full text-sm text-gray-500">
                    No slots available for this date.
                  </p>
                )}
                {timeSlots.map((slot, index) => {
                  const isSelected =
                    selectedSlot?.time === slot.time &&
                    selectedSlot?.date === selectedDate;
                  const isDisabled = !slot.available;

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        slot.available && handleTimeSlotSelect(slot.time)
                      }
                      disabled={isDisabled}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        isDisabled
                          ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                          : isSelected
                          ? "border-rose-500 bg-rose-500 text-white"
                          : "border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700"
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right side: Appointment Summary */}
        <div className="lg:col-span-1">
          <AppointmentSummary
            selectedSlot={selectedSlot}
            selectedServices={selectedServices}
            getTotalAmount={getTotalAmount}
            onNext={onNext}
            isValid={isValid}
            buttonText="Continue to Payment"
          />
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-6">
        <Button onClick={onBack} className="px-6 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
      </div>
    </div>
  );
}
