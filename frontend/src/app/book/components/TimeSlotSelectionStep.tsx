/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 11; hour <= 17; hour++) {
      const time12 =
        hour > 12
          ? `${hour - 12}:00 PM`
          : hour === 12
          ? `12:00 PM`
          : `${hour}:00 AM`;
      const available = Math.random() > 0.2;
      slots.push({ time: time12, available });
    }
    return slots;
  };

  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

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

  const handleTimeSlotSelect = (time: string) => {
    if (selectedDate) {
      setSelectedSlot({
        date: selectedDate,
        time: time,
      });
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Clear time selection when date changes
    if (selectedSlot?.date !== date) {
      setSelectedSlot(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Select Date & Time
        </h2>
        <p className="text-sm text-gray-600">
          Choose your preferred appointment slot
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
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
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot, index) => {
                const isSelected =
                  selectedSlot?.time === slot.time &&
                  selectedSlot?.date === selectedDate;
                const isDisabled = !slot.available || !selectedDate;

                return (
                  <button
                    key={index}
                    onClick={() =>
                      slot.available &&
                      selectedDate &&
                      handleTimeSlotSelect(slot.time)
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
          </Card>
        </div>

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

      <div className="flex justify-center pt-6">
        <Button onClick={onBack} className="px-6 bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Details
        </Button>
      </div>
    </div>
  );
}
