"use client";

import React from "react";
import { cn } from "@/lib/utils"; // optional

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-white rounded-3xl p-8 shadow-md relative overflow-hidden min-h-[280px] flex flex-col justify-between",
        className
      )}
    >
      {children}
    </div>
  );
}
