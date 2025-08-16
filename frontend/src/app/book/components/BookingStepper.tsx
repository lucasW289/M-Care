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
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile Stepper - Vertical Layout */}
        <div className="block md:hidden">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-8 mt-2 transition-all duration-500 ${
                        currentStep > step.id
                          ? "bg-gradient-to-b from-rose-500 to-purple-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div
                    className={`font-bold text-base transition-colors duration-300 ${
                      currentStep >= step.id ? "text-rose-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Stepper - Horizontal Layout */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div
                    className={`relative w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-500 mb-4 ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-2xl transform scale-110"
                        : "bg-gray-100 text-gray-500 shadow-md"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-7 h-7" />
                    ) : (
                      step.id
                    )}
                    {currentStep >= step.id && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-500 opacity-20 animate-pulse"></div>
                    )}
                  </div>
                  <div className="max-w-[200px]">
                    <div
                      className={`font-bold text-base lg:text-lg transition-colors duration-300 mb-1 ${
                        currentStep >= step.id
                          ? "text-rose-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500 leading-tight">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div
                      className={`h-1 rounded-full transition-all duration-500 ${
                        currentStep > step.id
                          ? "bg-gradient-to-r from-rose-500 to-purple-500 shadow-lg"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-purple-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
            Step {currentStep} of {steps.length}:{" "}
            {steps[currentStep - 1]?.title}
          </div>
        </div>
      </div>
    </section>
  );
}
