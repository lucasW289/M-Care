/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Phone,
  Shield,
  Award,
  Users,
  CheckCircle,
  Heart,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Header from "@/components/Header";
import { services } from "@/data/services";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-rose-50 via-pink-50 to-purple-50 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-lg font-semibold">
                  <Heart className="w-4 h-4" />
                  Confidential Sexual Health Care
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-none">
                  Your Sexual
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">
                    Health
                  </span>
                  <span className="block">Matters</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Comprehensive, confidential sexual health services in a safe
                  and judgment-free environment. Expert care for HIV prevention,
                  STI testing, and reproductive health.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Book An Appointment Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-8 pt-8">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 bg-rose-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-pink-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      15,000+ Patients Served
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 font-medium ml-1">
                      4.9/5 Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content - Feature Cards */}
              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[250px]">
                    <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
                      <Lock className="w-6 h-6 text-rose-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      100% Confidential
                    </h3>
                    <p className="text-base text-gray-700">
                      Complete privacy and discretion in all consultations and
                      treatments.
                    </p>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] mt-8 md:mt-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Safe Environment
                    </h3>
                    <p className="text-base text-gray-700">
                      Judgment-free zone with compassionate healthcare
                      professionals.
                    </p>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] -mt-4 md:mt-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Expert Specialists
                    </h3>
                    <p className="text-base text-gray-700">
                      Board-certified sexual health and infectious disease
                      specialists.
                    </p>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-0 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] mt-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      Accredited Clinic
                    </h3>
                    <p className="text-base text-gray-700">
                      Internationally recognized sexual health treatment center.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Why Choose Our Sexual Health Clinic?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We understand that sexual health is personal. That's why we
                provide the highest standard of care in a completely
                confidential environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Complete Privacy
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is our priority. All consultations and treatments
                  are completely confidential with secure medical records.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Compassionate Care
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our healthcare professionals provide judgment-free,
                  compassionate care in a safe and welcoming environment.
                </p>
              </div>

              <div className="text-center p-8">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Expert Treatment
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Board-certified specialists with extensive experience in
                  sexual health, HIV prevention, and STI treatment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <Footer />
      </div>
    </>
  );
}
