/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
        `${process.env.NEXT_PUBLIC_API_URL}/availability?date=${date}`
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

  const isPastSlot = (time: string, date: string) => {
    const [year, month, day] = date.split("-").map(Number);

    // Convert 12-hour format to 24-hour
    const [timePart, modifier] = time.split(" ");
    const [hoursStr, minutesStr] = timePart.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr || "0", 10);

    if (modifier?.toLowerCase() === "pm" && hours < 12) {
      hours += 12;
    }
    if (modifier?.toLowerCase() === "am" && hours === 12) {
      hours = 0;
    }

    const slotDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
    return slotDate < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Select Your Appointment
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Choose your preferred date and time slot for your appointment
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-9 gap-8">
        <div className="xl:col-span-6 space-y-8">
          {/* Date Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Choose Date
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select your preferred appointment date
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date.value}
                    onClick={() => handleDateSelect(date.value)}
                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      selectedDate === date.value
                        ? "border-pink-500 bg-pink-50 shadow-lg shadow-pink-100"
                        : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        selectedDate === date.value
                          ? "text-pink-700"
                          : "text-gray-700"
                      }`}
                    >
                      {date.label}
                    </div>
                    {date.isToday && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Today
                      </div>
                    )}
                    {selectedDate === date.value && (
                      <CheckCircle2 className="w-5 h-5 text-pink-500 absolute -top-2 -left-2 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    Choose Time
                  </h3>
                  <p className="text-sm text-gray-600">
                    {!selectedDate
                      ? "Select a date first"
                      : "Pick your preferred time slot"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">
                      Loading available slots...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.length === 0 && selectedDate && (
                    <div className="col-span-full text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No slots available for this date
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Please try selecting a different date
                      </p>
                    </div>
                  )}
                  {timeSlots.map((slot, index) => {
                    const isSelected =
                      selectedSlot?.time === slot.time &&
                      selectedSlot?.date === selectedDate;

                    const past = isPastSlot(slot.time, selectedDate);
                    const isDisabled = !slot.available || past;

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          !isDisabled && handleTimeSlotSelect(slot.time)
                        }
                        disabled={isDisabled}
                        className={`group relative p-4 rounded-xl border-2 font-medium transition-all duration-200 hover:scale-105 ${
                          isDisabled
                            ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
                            : isSelected
                            ? "border-pink-500 bg-pink-50 text-pink-700 shadow-lg shadow-pink-100"
                            : "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700"
                        }`}
                      >
                        <div className="text-sm">{slot.time}</div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-pink-500 absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                        {isDisabled && (
                          <div className="absolute inset-0 bg-gray-100 bg-opacity-60 rounded-xl flex flex-col items-center justify-center text-xs text-gray-500">
                            <span>{slot.time}</span>
                            <span className="mt-1">{"Unavailable"}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="xl:col-span-3">
          <div className="sticky top-6">
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
      </div>

      <div className="flex justify-center pt-12 sm:pt-16">
        <Button
          onClick={onBack}
          className="bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-8 py-4 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Services</span>
        </Button>
      </div>
    </div>
  );
}
