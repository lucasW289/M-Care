"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Text Logo Component
const MCareTextLogo: React.FC = () => (
  <span className="text-black text-3xl md:text-5xl font-extrabold p-1">
    M-Care
  </span>
);

// Flag Props
interface FlagProps {
  src: string;
  alt: string;
  isSelected: boolean;
}

const Flag: React.FC<FlagProps> = ({ src, alt, isSelected }) => (
  <div
    className={`w-8 h-8 md:w-11 md:h-11 rounded-full flex items-center justify-center p-[2px] transition-all duration-200 ${
      isSelected ? "bg-yellow-400" : "bg-gray-400"
    }`}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full rounded-full object-cover border-2 border-white"
    />
  </div>
);

// Hamburger Icon
const HamburgerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-8 h-8 text-[#5c4c47]"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

// Close Icon
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-8 h-8 text-[#5c4c47]"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

interface HeaderProps {
  bgColor?: string;
}

const Header: React.FC<HeaderProps> = ({ bgColor = "" }) => {
  const pathname = usePathname();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "th">("en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "HomePage" },
    { href: "/services", label: "Services" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="relative z-50 bg-[#fef9f7] shadow-md py-2">
      <div className="flex items-center justify-between w-full px-4 md:px-8 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 group rounded-md p-1 -m-1"
        >
          <MCareTextLogo style={{ color: "#332522" }} />
        </Link>

        {/* Desktop Nav + Language */}
        <div className="flex items-center space-x-8">
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-extrabold transition-colors duration-300 px-4 py-2 rounded-lg cursor-pointer ${
                  isActive(href)
                    ? "text-[#ffa092] border-b-2 border-[#ffa092]"
                    : "text-[#5c4c47] hover:text-[#ffa092]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher + Mobile Menu Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedLanguage("th")}
              aria-label="Switch to Thai"
              className="focus:outline-none rounded-full p-1"
            >
              <Flag
                src="https://flagcdn.com/th.svg"
                alt="Thai Flag"
                isSelected={selectedLanguage === "th"}
              />
            </button>

            <span className="text-[#5c4c47] mx-1 select-none">|</span>

            <button
              onClick={() => setSelectedLanguage("en")}
              aria-label="Switch to English"
              className="focus:outline-none rounded-full p-1"
            >
              <Flag
                src="https://flagcdn.com/gb.svg"
                alt="UK Flag"
                isSelected={selectedLanguage === "en"}
              />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden ml-4 p-2 focus:outline-none focus:ring-2 focus:ring-[#ffa092] rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#fff6f1] z-50 flex flex-col items-center justify-center p-8 md:hidden">
          <button
            className="absolute top-4 right-4 p-2 focus:outline-none focus:ring-2 focus:ring-[#ffa092] rounded-md"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <CloseIcon />
          </button>

          <nav className="flex flex-col items-center space-y-6 w-full max-w-xs">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-extrabold transition-colors duration-300 px-6 py-3 rounded-lg w-full text-center cursor-pointer ${
                  isActive(href)
                    ? "bg-[#ffa092] text-white shadow-md"
                    : "text-[#5c4c47] hover:bg-[#ffb3aa]"
                } focus:outline-none focus:ring-2 focus:ring-[#ffa092]`}
                onClick={closeMobileMenu}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
