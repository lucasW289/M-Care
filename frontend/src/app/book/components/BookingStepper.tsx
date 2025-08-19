import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface BookingStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function BookingStepper({
  steps,
  currentStep,
}: BookingStepperProps) {
  return (
    <section className="py-6 sm:py-12 bg-white border-b border-gray-100">
      <div className="max-w-3xl sm:max-w-6xl mx-auto px-3 sm:px-4">
        {/* Mobile Stepper - Vertical Layout */}
        <div className="block md:hidden">
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-6 sm:h-8 mt-1 sm:mt-2 transition-all duration-500 ${
                        currentStep > step.id
                          ? "bg-gradient-to-b from-rose-500 to-purple-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1 pb-6 sm:pb-8">
                  <div
                    className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                      currentStep >= step.id ? "text-rose-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-0.5">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Stepper - Horizontal Layout */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div
                  className={`relative w-10 sm:w-14 h-10 sm:h-14 rounded-2xl flex items-center justify-center font-bold text-sm sm:text-lg transition-all duration-500 mb-3 sm:mb-4 ${
                    currentStep >= step.id
                      ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-500 shadow-md"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 sm:w-7 h-5 sm:h-7" />
                  ) : (
                    step.id
                  )}
                  {currentStep >= step.id && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-500 opacity-20 animate-pulse"></div>
                  )}
                </div>
                <div className="max-w-[150px] sm:max-w-[200px]">
                  <div
                    className={`font-semibold text-sm sm:text-base lg:text-lg transition-colors duration-300 mb-1 ${
                      currentStep >= step.id ? "text-rose-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500 leading-tight">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 px-2 sm:px-4">
                  <div
                    className={`h-0.5 sm:h-1 rounded-full transition-all duration-500 ${
                      currentStep > step.id
                        ? "bg-gradient-to-r from-rose-500 to-purple-500 shadow"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current Step Indicator */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            Step {currentStep} of {steps.length}:{" "}
            {steps[currentStep - 1]?.title}
          </div>
        </div>
      </div>
    </section>
  );
}
