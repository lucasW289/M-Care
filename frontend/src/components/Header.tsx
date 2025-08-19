"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
// MCareTextLogo
const MCareTextLogo: React.FC = () => (
  <Link href="/" className="flex items-center space-x-3 group">
    {/* Custom 'M+' Icon */}
    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
      <svg
        className="w-7 h-7 text-white"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
      >
        {/* The 'M' shape */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 20V8L12 16L20 8V20"
        />
        {/* The '+' shape */}
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4V10M9 7H15"
        />
      </svg>
    </div>
    <span className="text-foreground text-3xl font-bold tracking-tight group-hover:text-primary transition-colors duration-200">
      M-Care
    </span>
  </Link>
);

const MenuIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className="w-6 h-6 flex flex-col justify-center items-center">
    <span
      className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
        isOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
      }`}
    />
    <span
      className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
        isOpen ? "opacity-0" : "opacity-100"
      }`}
    />
    <span
      className={`bg-foreground block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
        isOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
      }`}
    />
  </div>
);

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* CHANGED: Increased header height from h-16 to h-20 */}
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <MCareTextLogo />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  /* CHANGED: Increased font size, padding, and tweaked active/hover styles */
                  className={`text-base font-medium transition-all duration-200 relative group px-3 py-2 rounded-lg ${
                    isActive(href)
                      ? "text-primary bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  }`}
                >
                  {label}
                  <span
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${
                      isActive(href)
                        ? "w-4/5 bg-rose-500"
                        : "w-0 group-hover:w-full bg-primary"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden h-10 w-10 rounded-lg hover:bg-muted/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (No changes here) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={closeMobileMenu}
          />

          {/* Menu content */}
          <div className="relative bg-background h-full w-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <MCareTextLogo />
              <button
                className="h-10 w-10 rounded-lg hover:bg-muted/20 transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <MenuIcon isOpen={true} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col p-6 space-y-2 flex-1">
              {navLinks.map(({ href, label }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-base font-medium transition-all duration-200 px-4 py-3 rounded-lg transform ${
                    isActive(href)
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg animate-fade-in-up"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  } ${
                    isMobileMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen
                      ? `${index * 50}ms`
                      : "0ms",
                  }}
                  onClick={closeMobileMenu}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
