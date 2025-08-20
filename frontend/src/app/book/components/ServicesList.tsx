"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Search,
  Check,
  Clock,
  Shield,
  Star,
  Zap,
  ChevronRight,
  Sparkles,
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
    <div className="space-y-4 px-2 sm:px-4 md:px-0 relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-pink-50/30 -z-10 rounded-3xl"></div>
      <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-pink-100/20 to-transparent rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-200/50 shadow-lg shadow-slate-900/5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            Available Services
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Choose from our service offerings
          </p>
        </div>

        <div className="relative w-full sm:w-80 mt-2 sm:mt-0">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg shadow-slate-900/5 overflow-hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 sm:py-4 bg-transparent focus:outline-none text-slate-900 placeholder-slate-400 text-sm sm:text-base font-medium rounded-2xl"
            />
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transform scale-x-0 transition-transform duration-300 focus-within:scale-x-100"></div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => {
          const isSelected = selectedServices.find(
            (s) => s.title === service.title
          );

          return (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-300 group relative overflow-hidden rounded-2xl sm:rounded-3xl transform hover:scale-[1.02] ${
                isSelected
                  ? "border-2 border-pink-400/50 bg-gradient-to-br from-pink-50/80 to-purple-50/40 shadow-xl shadow-pink-500/10 backdrop-blur-sm"
                  : "border border-slate-200/50 hover:border-pink-300/50 bg-white/90 hover:bg-white backdrop-blur-sm hover:shadow-xl hover:shadow-slate-900/10"
              }`}
              onClick={() => onServiceToggle(service)}
            >
              {isSelected && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-pink-500 via-purple-500 to-pink-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
                </>
              )}

              <div className="p-4 sm:p-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3 sm:mb-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isSelected
                          ? "bg-gradient-to-br from-pink-500 to-purple-600 border-pink-500 shadow-pink-500/25"
                          : "border-slate-300 group-hover:border-pink-400 bg-white shadow-slate-200"
                      }`}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3] animate-in zoom-in duration-200" />
                      )}
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-pink-800 transition-colors truncate max-w-[180px] sm:max-w-[250px]">
                          {service.title}
                        </h3>
                        {service.isPopular && (
                          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 sm:gap-2 shadow-md animate-pulse">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                            Popular
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div
                      className={`text-lg sm:text-2xl font-black truncate ${
                        isSelected
                          ? "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"
                          : "text-slate-900"
                      }`}
                    >
                      {service.price > 0
                        ? `₿${service.price.toLocaleString()}`
                        : "Free"}
                    </div>
                    {service.price > 0 && (
                      <div className="text-xs sm:text-sm text-slate-500 font-medium"></div>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed pl-8 sm:pl-10 font-medium">
                  {service.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 pl-8 sm:pl-10 flex-wrap">
                  <div className="flex flex-wrap gap-2">
                    {service.duration && (
                      <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-xl bg-slate-100/80 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200/50 shadow-sm">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {service.duration}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-xl bg-emerald-100/80 text-emerald-700 text-xs sm:text-sm font-semibold border border-emerald-200/50 shadow-sm">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                      Confidential
                    </span>
                    {service.price === 0 && (
                      <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-xl bg-green-100/80 text-green-700 text-xs sm:text-sm font-semibold border border-green-200/50 shadow-sm">
                        <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                        Free
                      </span>
                    )}
                  </div>

                  {isSelected ? (
                    <span className="text-xs sm:text-sm text-pink-600 font-bold flex items-center gap-1.5 sm:gap-2 bg-pink-50/80 px-3 py-1.5 rounded-xl border border-pink-200/50">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Added
                    </span>
                  ) : (
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-pink-500 transition-all duration-300 group-hover:translate-x-1" />
                  )}
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-2xl sm:rounded-3xl"></div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
