/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Search,
  Check,
  Clock,
  Shield,
  Star,
  Zap,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ServicesListProps {
  services: any[];
  selectedServices: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onServiceToggle: (service: any) => void;
}

export default function ServicesList({
  services,
  selectedServices,
  searchQuery,
  setSearchQuery,
  onServiceToggle,
}: ServicesListProps) {
  return (
    <div className="space-y-4 px-4 sm:px-6 md:px-0">
      {/* Header + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900">
          Available Services
        </h2>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent 
                       bg-white shadow-sm text-sm"
          />
        </div>
      </div>

      {/* Service Cards */}
      <div className="space-y-3">
        {services.map((service, index) => {
          const isSelected = selectedServices.find(
            (s) => s.title === service.title
          );

          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 group relative overflow-hidden 
                          rounded-2xl ${
                            isSelected
                              ? "border-2 border-rose-400 bg-rose-50/30 shadow-lg"
                              : "border border-gray-200 hover:border-rose-300 bg-white hover:shadow-md"
                          }`}
              onClick={() => onServiceToggle(service)}
            >
              <div className="p-4 sm:p-5">
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  {/* Left side */}
                  <div className="flex items-center gap-3">
                    {/* Check Circle */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 
                        ${
                          isSelected
                            ? "bg-rose-500 border-rose-500"
                            : "border-gray-300 group-hover:border-rose-400"
                        }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      )}
                    </div>

                    {/* Title + Popular Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-rose-800 transition-colors">
                        {service.title}
                      </h3>
                      {service.isPopular && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div
                      className={`text-lg sm:text-2xl font-black ${
                        isSelected ? "text-rose-600" : "text-gray-900"
                      }`}
                    >
                      {service.price > 0
                        ? `₿${service.price.toLocaleString()}`
                        : "Free"}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 leading-relaxed pl-8 sm:pl-8">
                  {service.description}
                </p>

                {/* Tags & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pl-8">
                  <div className="flex flex-wrap gap-2">
                    {service.duration && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        {service.duration}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">
                      <Shield className="w-3 h-3" />
                      Confidential
                    </span>
                    {service.price === 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        Free
                      </span>
                    )}
                  </div>

                  {/* Right side: Status */}
                  {isSelected ? (
                    <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Added to booking
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-400 transition-colors" />
                  )}
                </div>
              </div>

              {/* Selection Bar */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-pink-500"></div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
