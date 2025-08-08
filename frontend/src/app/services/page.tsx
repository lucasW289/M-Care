"use client";

import { useState } from "react";
import Header from "@/components/Header";

type Service = {
  title: string;
  description: string;
  price: number;
};

const services: Service[] = [
  {
    title: "Virtual Consultation",
    description:
      "Speak with a licensed sexual health specialist from anywhere.",
    price: 20,
  },
  {
    title: "Comprehensive STI Testing",
    description:
      "At-home collection kit with results delivered confidentially.",
    price: 35,
  },
  {
    title: "HIV PrEP Consultation",
    description: "Get assessed and prescribed preventive HIV medication.",
    price: 25,
  },
  {
    title: "Prescription Delivery",
    description: "Discreet delivery of medications right to your door.",
    price: 10,
  },
  {
    title: "Follow-up Consultation",
    description: "Talk to a doctor about your test results and next steps.",
    price: 15,
  },
  {
    title: "Sexual Wellness Counseling",
    description:
      "Confidential sessions to support your mental and sexual health.",
    price: 30,
  },
];

export default function ServicesPage() {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set()
  );
  const [qrSVG, setQrSVG] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (title: string) => {
    setSelectedServices((prev) => {
      const updated = new Set(prev);
      if (updated.has(title)) updated.delete(title);
      else updated.add(title);
      return updated;
    });
    setQrSVG(null);
    setError(null);
  };

  const totalPrice = services
    .filter((service) => selectedServices.has(service.title))
    .reduce((sum, service) => sum + service.price, 0);

  async function handleBookNow() {
    setLoading(true);
    setError(null);
    setQrSVG(null);

    try {
      const response = await fetch("http://localhost:3007/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!response.ok) throw new Error("Failed to generate QR code");

      // IMPORTANT: parse as text, NOT json
      const svgText = await response.text();
      setQrSVG(svgText);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen text-[#0B1C2C] bg-[#F7FAFC]">
      <Header />

      <section className="px-6 md:px-12 lg:px-20 py-16 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
        <p className="text-lg text-[#2F4858] mb-12 max-w-2xl">
          We provide modern, accessible sexual health services tailored to your
          needs. Select services to book online.
        </p>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {services.map((service) => (
            <label
              key={service.title}
              className={`cursor-pointer bg-white p-6 rounded-xl shadow-md transition-shadow hover:shadow-lg border ${
                selectedServices.has(service.title)
                  ? "border-[#41BDC7] ring-2 ring-[#41BDC7]"
                  : "border-transparent"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedServices.has(service.title)}
                  onChange={() => toggleService(service.title)}
                  className="mt-1 accent-[#41BDC7]"
                />
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {service.title}
                  </h2>
                  <p className="text-[#425466] mb-2">{service.description}</p>
                  <p className="text-[#0B1C2C] font-semibold">
                    ${service.price}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* Booking Summary */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="text-lg">
            Selected:{" "}
            <span className="font-semibold">
              {selectedServices.size}{" "}
              {selectedServices.size === 1 ? "service" : "services"}
            </span>
            , Total:{" "}
            <span className="font-bold text-[#0B1C2C]">${totalPrice}</span>
          </div>

          <button
            disabled={selectedServices.size === 0 || loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition ${
              selectedServices.size > 0 && !loading
                ? "bg-[#41BDC7] hover:bg-[#3AAFB8]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleBookNow}
          >
            {loading ? "Generating QR..." : "Book Now"}
          </button>
        </div>

        {/* QR Code Display */}
        {error && <p className="mt-6 text-red-600 font-semibold">{error}</p>}

        {qrSVG && (
          <div className="mt-6" dangerouslySetInnerHTML={{ __html: qrSVG }} />
        )}
      </section>
    </main>
  );
}
