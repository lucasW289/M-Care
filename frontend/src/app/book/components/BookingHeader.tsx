import { Heart } from "lucide-react";

export default function BookingHeader() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-24 h-24 sm:w-32 sm:h-32 bg-rose-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 right-8 w-32 h-32 sm:w-40 sm:h-40 bg-purple-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-xl sm:max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            Confidential Booking System
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
            Book Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600">
              Health Journey
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed">
            Schedule your confidential sexual health consultation with our
            expert specialists. Complete your booking in four simple steps.
          </p>
        </div>
      </div>
    </section>
  );
}
