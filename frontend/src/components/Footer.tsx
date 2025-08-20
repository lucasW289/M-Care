"use client";
import React from "react";
import { Phone, MapPin, Clock, ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-gray-900 via-rose-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Section */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black leading-tight">
              Ready to Take Control of Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                Sexual Health?
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed">
              Book a confidential consultation today. Our expert team is here to
              provide you with professional, judgment-free sexual health care.
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                {
                  icon: <Phone className="w-6 h-6 text-rose-400" />,
                  label: "Confidential Hotline",
                  value: "+66 2 123 4567",
                  bg: "bg-rose-500/20",
                },
                {
                  icon: <MapPin className="w-6 h-6 text-purple-400" />,
                  label: "Private Clinic Location",
                  value: "123 Wellness Street, Bangkok",
                  bg: "bg-purple-500/20",
                },
                {
                  icon: <Clock className="w-6 h-6 text-pink-400" />,
                  label: "Consultation Hours",
                  value: "Mon-Fri: 9AM–7PM, Sat: 9AM–5PM",
                  bg: "bg-pink-500/20",
                },
                {
                  icon: <Mail className="w-6 h-6 text-pink-400" />,
                  label: "Email Us",
                  value: "6531501204@lamduan.mfu.ac.th",
                  bg: "bg-pink-500/20",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-full flex items-center justify-center`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      {item.label}
                    </div>
                    <div className="text-gray-300 text-sm sm:text-base">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <Link href="/book" className="flex items-center">
                Schedule Confidential Appointment{" "}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Right Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Find Our Clinic
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
              Conveniently located in central Bangkok with discrete parking and
              private entrances.
            </p>

            {/* Google Maps Embed */}
            <div className="relative w-full h-56 sm:h-80 mb-6 rounded-xl overflow-hidden border border-white/20 shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d45459.89964980939!2d100.5229186611803!3d13.728391257120999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f26ed4bb01b%3A0xac01b20801f96936!2sLumphini%20Park!5e0!3m2!1sen!2sth!4v1755680549020!5m2!1sen!2sth"
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl flex items-center justify-center"
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/yr4ZUA6TBJDuKy3f7",
                    "_blank"
                  )
                }
              >
                <MapPin className="w-4 h-4 mr-2" />
                Open in Maps
              </Button>
              <Button
                className="w-full  border-white/20 text-white hover:bg-white/10 rounded-xl flex items-center justify-center"
                onClick={() =>
                  window.open(
                    "https://maps.app.goo.gl/yr4ZUA6TBJDuKy3f7",
                    "_blank"
                  )
                }
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>

            {/* Transportation Info */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10 text-sm sm:text-base">
              <h4 className="font-semibold text-white mb-2">Getting Here</h4>
              <ul className="space-y-1 text-gray-300">
                <li>🚆 BTS Skytrain: 5-minute walk from Asok Station</li>
                <li>🚇 MRT Subway: 7-minute walk from Sukhumvit Station</li>
                <li>🚗 Private parking with discrete entrance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
