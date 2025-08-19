/* eslint-disable @typescript-eslint/no-explicit-any */
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
    <div className="space-y-2 px-2 sm:px-4 md:px-0">
      {/* Header + Search */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Available Services
        </h2>

        <div className="relative w-full sm:w-56 mt-1 sm:mt-0">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-xl 
                       focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent 
                       bg-white shadow-sm text-base"
          />
        </div>
      </div>

      {/* Service Cards */}
      <div className="space-y-1">
        {services.map((service, index) => {
          const isSelected = selectedServices.find(
            (s) => s.title === service.title
          );

          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 group relative overflow-hidden rounded-xl ${
                isSelected
                  ? "border-2 border-rose-400 bg-rose-50/30 shadow-md"
                  : "border border-gray-200 hover:border-rose-300 bg-white hover:shadow-sm"
              }`}
              onClick={() => onServiceToggle(service)}
            >
              <div className="p-2 sm:p-2.5">
                {/* Top Row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5">
                    {/* Check Circle */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 
                        ${
                          isSelected
                            ? "bg-rose-500 border-rose-500"
                            : "border-gray-300 group-hover:border-rose-400"
                        }`}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-white stroke-[2]" />
                      )}
                    </div>

                    {/* Title + Popular Badge */}
                    <div className="flex flex-wrap items-center gap-1">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-rose-800 transition-colors">
                        {service.title}
                      </h3>
                      {service.isPopular && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div
                      className={`text-base font-black ${
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
                <p className="text-[10px] sm:text-base text-gray-600 mb-1 leading-snug pl-5">
                  {service.description}
                </p>

                {/* Tags & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pl-5">
                  <div className="flex flex-wrap gap-1">
                    {service.duration && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-[9px] font-medium">
                        <Clock className="w-2.5 h-2.5" />
                        {service.duration}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 text-[9px] font-medium">
                      <Shield className="w-2.5 h-2.5" />
                      Confidential
                    </span>
                    {service.price === 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-green-100 text-green-700 text-[9px] font-medium">
                        <Zap className="w-2.5 h-2.5" />
                        Free
                      </span>
                    )}
                  </div>

                  {isSelected ? (
                    <span className="text-[9px] text-rose-600 font-semibold flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      Added
                    </span>
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-rose-400 transition-colors" />
                  )}
                </div>
              </div>

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
