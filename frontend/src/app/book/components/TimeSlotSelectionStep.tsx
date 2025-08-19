/* eslint-disable react-hooks/exhaustive-deps */
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

  const fetchTimeSlots = async (date: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3007/availability?date=${date}`
      );
      if (!res.ok) throw new Error("Failed to fetch slots");
      const data = await res.json();
      setTimeSlots(data.availability || []);
    } catch (err) {
      console.error(err);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (availableDates.length > 0) {
      const today = availableDates[0].value;
      setSelectedDate(today);
      fetchTimeSlots(today);
    }
  }, []);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    fetchTimeSlots(date);
  };

  const handleTimeSlotSelect = (time: string) => {
    if (selectedDate) {
      setSelectedSlot({ date: selectedDate, time });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
          Select Date & Time
        </h2>
        <p className="text-sm text-gray-600">
          Choose your preferred appointment slot
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left side */}
        <div className="lg:col-span-2 space-y-3">
          {/* Date Selection */}
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Select Date
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => handleDateSelect(date.value)}
                  className={`p-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                    selectedDate === date.value
                      ? "border-rose-500 bg-rose-50 text-rose-700"
                      : "border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-700"
                  }`}
                >
                  <div>{date.label}</div>
                  {date.isToday && (
                    <div className="text-[10px] text-rose-600">Today</div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Time Selection */}
          <Card className="p-3 sm:p-2 h-[30px]">
            <div className="flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-600" />
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Select Time
                </h3>
                {!selectedDate && (
                  <span className="text-xs text-gray-500">
                    (Select a date first)
                  </span>
                )}
              </div>

              {/* Slots */}
              {loading ? (
                <p className="text-base text-gray-500">Loading slots...</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-5">
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
                        className={`p-1 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
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
            </div>
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
