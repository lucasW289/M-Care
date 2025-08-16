"use client";
import {
  ArrowRight,
  CheckCircle,
  Heart,
  Lock,
  Users,
  Shield,
  Award,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useServices } from "@/context/ServicesContext"; // adjust path

export default function ServicesPage() {
  const { services, loading, error } = useServices();

  if (loading) return <p className="text-center mt-20">Loading services...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-6 py-3 rounded-full text-sm font-semibold">
              <Heart className="w-4 h-4" /> Comprehensive Sexual Health Services
            </div>
            <h1 className="text-4xl lg:text-7xl font-black text-gray-900 leading-tight">
              Professional{" "}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">
                Sexual Health
              </span>
              <span className="block">Care</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Confidential, expert sexual health services in a safe and
              judgment-free environment. From HIV prevention to reproductive
              health, we provide comprehensive care tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                Book Consultation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-2xl">
                Call Now: +66 2 123 4567
                <Phone className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* All Services */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                All Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Complete list of our sexual health services with transparent
                pricing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, index) => {
                const colors = [
                  {
                    bg: "bg-gradient-to-br from-rose-500 to-pink-600",
                    accent: "bg-rose-100",
                    text: "text-rose-600",
                    border: "border-rose-200",
                  },
                  {
                    bg: "bg-gradient-to-br from-purple-500 to-indigo-600",
                    accent: "bg-purple-100",
                    text: "text-purple-600",
                    border: "border-purple-200",
                  },
                  {
                    bg: "bg-gradient-to-br from-pink-500 to-rose-600",
                    accent: "bg-pink-100",
                    text: "text-pink-600",
                    border: "border-pink-200",
                  },
                  {
                    bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
                    accent: "bg-indigo-100",
                    text: "text-indigo-600",
                    border: "border-indigo-200",
                  },
                  {
                    bg: "bg-gradient-to-br from-violet-500 to-purple-600",
                    accent: "bg-violet-100",
                    text: "text-violet-600",
                    border: "border-violet-200",
                  },
                  {
                    bg: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
                    accent: "bg-fuchsia-100",
                    text: "text-fuchsia-600",
                    border: "border-fuchsia-200",
                  },
                ];
                const color = colors[index % colors.length];

                return (
                  <Card
                    key={index}
                    className={`bg-white border-2 ${color.border} rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2`}
                  >
                    <div className={`${color.bg} h-2`}></div>
                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className={`w-12 h-12 sm:w-14 sm:h-14 ${color.accent} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                        >
                          <CheckCircle
                            className={`w-6 h-6 sm:w-7 sm:h-7 ${color.text}`}
                          />
                        </div>
                        {service.isPopular && (
                          <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Popular
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                        {service.description}
                      </p>

                      {service.features && (
                        <ul className="space-y-2 mb-6">
                          {service.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle
                                className={`w-4 h-4 ${color.text}`}
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-100 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 font-medium">
                            {service.price > 0 ? "Starting from" : "Cost"}
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-gray-900">
                            {service.price > 0
                              ? `₿${service.price.toLocaleString()}`
                              : "Free"}
                          </div>
                          {service.duration && (
                            <div className="text-xs text-gray-500 mt-1">
                              Duration: {service.duration}
                            </div>
                          )}
                        </div>
                        <Button
                          className={`${color.bg} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto`}
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        {/* ... keep same */}
        <Footer />
      </div>
    </>
  );
}
