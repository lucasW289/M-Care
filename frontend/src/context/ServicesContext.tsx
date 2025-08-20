/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ServicesContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Service {
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  isPopular?: boolean;
}

interface ServicesContextType {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: () => void;
}

const ServicesContext = createContext<ServicesContextType | undefined>(
  undefined
);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services` ||
          "http://localhost:3007/services"
      ); // your backend endpoint
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      setServices(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <ServicesContext.Provider
      value={{ services, loading, error, fetchServices }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

// Custom hook for easy access
export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context)
    throw new Error("useServices must be used within ServicesProvider");
  return context;
};
