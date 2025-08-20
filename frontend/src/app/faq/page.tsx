/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FAQPage() {
  // Explicitly type the state to be an array of numbers
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment by clicking the 'Schedule Confidential Appointment' button on our website and following the prompts.",
    },
    {
      question: "Is my information confidential?",
      answer:
        "Absolutely. All your personal information and consultation details are kept strictly confidential.",
    },
    {
      question: "Do you offer online consultations?",
      answer:
        "Yes, we offer online consultations via secure video calls for your convenience and privacy.",
    },
    {
      question: "What services do you provide?",
      answer:
        "We provide sexual health consultations, testing, treatment, and advice for a range of sexual health concerns.",
    },
    {
      question: "What are your consultation hours?",
      answer:
        "Our clinic operates Monday to Friday from 9AM to 7PM, and Saturday from 9AM to 5PM.",
    },
    {
      question: "Do you accept walk-ins?",
      answer:
        "We recommend booking appointments in advance, but limited walk-ins are accepted depending on availability.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept cash, credit cards, and some digital payment methods. Details are provided during booking.",
    },
    {
      question: "Can I reschedule my appointment?",
      answer:
        "Yes, you can reschedule by contacting us at least 24 hours before your scheduled appointment.",
    },
  ];

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50/30 to-red-50/50 relative overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400/40 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-400/40 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-rose-400/40 rounded-full animate-bounce delay-1100"></div>
        </div>

        <section className="relative py-24 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-pink-50/60 to-red-50/80 backdrop-blur-sm"></div>

          <div className="relative max-w-7xl mx-auto px-4 text-center space-y-12">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-md border border-white/20 text-slate-700 px-8 py-4 rounded-full text-sm font-semibold mx-auto shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent font-bold">
                Frequently Asked Questions
              </span>
              <Sparkles className="w-4 h-4 text-pink-500" />
            </div>

            <div className="space-y-6">
              <h1 className="text-xl lg:text-5xl font-black leading-tight">
                <span className="text-slate-900">Your Questions</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-red-600 animate-pulse">
                  Answered
                </span>
              </h1>

              <div className="flex items-center justify-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-pink-500" />
                  <span>100% Confidential</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <p className="text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Find answers to common questions about our sexual health services,
              privacy policies, and appointment procedures. We're here to help
              you feel informed and comfortable.
            </p>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl p-2 shadow-2xl">
                <div className="relative">
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-slate-700 placeholder-slate-400 font-medium"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24 bg-gradient-to-b from-transparent to-white/50">
          <div className="max-w-4xl mx-auto px-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <HelpCircle className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">
                  No questions found
                </h3>
                <p className="text-xl text-slate-600">
                  Try adjusting your search terms.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((faq, index) => {
                  const isOpen = openItems.includes(index);

                  return (
                    // Replaced Card with a div
                    <div
                      key={index}
                      className={`group relative bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? "ring-2 ring-pink-500/20 shadow-xl"
                          : "shadow-md hover:shadow-lg"
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="relative w-full text-left focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:ring-inset transition-all duration-300"
                      >
                        <div className="flex items-center justify-between p-6">
                          <h3
                            className={`font-semibold transition-all duration-300 ${
                              isOpen
                                ? "text-lg lg:text-xl text-pink-700"
                                : "text-sm lg:text-base text-slate-900 group-hover:text-pink-600"
                            }`}
                          >
                            {faq.question}
                          </h3>
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 transform ${
                              isOpen
                                ? "bg-gradient-to-br from-pink-500 to-red-600 text-white rotate-180 scale-110 shadow"
                                : "bg-slate-100 text-slate-600 group-hover:bg-gradient-to-br group-hover:from-pink-100 group-hover:to-red-100 group-hover:text-pink-600"
                            }`}
                          >
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6">
                          <div className="bg-gradient-to-br from-pink-50/50 to-red-50/50 rounded-xl p-6 backdrop-blur-sm border border-white/20 transition-all duration-300">
                            <p className="text-base lg:text-lg text-slate-700 leading-relaxed font-medium">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
