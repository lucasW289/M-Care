"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Optional utility to join classnames; if you don't have it just remove usage

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white transition-colors",
        "bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
