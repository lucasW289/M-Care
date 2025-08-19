/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Heart, Plus, Minus, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SelectedServicesSidebarProps {
  selectedServices: any[];
  onUpdateQuantity: (serviceTitle: string, change: number) => void;
  onRemoveService: (serviceTitle: string) => void;
  getTotalAmount: () => number;
  onNext: () => void;
  isValid: boolean;
  buttonText: string;
}

export default function SelectedServicesSidebar({
  selectedServices,
  onUpdateQuantity,
  onRemoveService,
  getTotalAmount,
  onNext,
  isValid,
  buttonText,
}: SelectedServicesSidebarProps) {
  return (
    <Card className="bg-white border-2 border-gray-100 rounded-2xl p-4 sm:p-6 shadow-lg lg:sticky lg:top-6">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-rose-500 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        Selected Services
      </h3>

      {selectedServices.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm sm:text-base">
            No services selected yet
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Choose from the list to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {selectedServices.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-rose-200"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    {service.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    ₿{service.price.toLocaleString()} each
                  </p>
                </div>
                <button
                  onClick={() => onRemoveService(service.title)}
                  className="w-5 h-5 sm:w-6 sm:h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-sm sm:text-base">
                    ₿{(service.price * service.quantity).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t border-rose-200 pt-3 sm:pt-4 mt-4 sm:mt-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-base sm:text-lg font-bold text-gray-900">
                Total Amount:
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-600">
                ₿{getTotalAmount().toLocaleString()}
              </span>
            </div>

            <Button
              onClick={onNext}
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
