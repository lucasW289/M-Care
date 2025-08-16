/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

interface QRCodeSVGProps {
  amount: number;
  reference?: string;
}

export default function QRCodeSVG({ amount, reference }: QRCodeSVGProps) {
  const [svgData, setSvgData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQR() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3007/qr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount, // must be a number
            reference: reference || "",
          }),
        });

        if (!res.ok) {
          const errMsg = await res.text();
          throw new Error(`Server error ${res.status}: ${errMsg}`);
        }

        const svgText = await res.text(); // get raw SVG string
        setSvgData(svgText);
      } catch (err: any) {
        console.error("QR Fetch Error:", err);
        setError(err.message || "Failed to fetch QR code");
      } finally {
        setLoading(false);
      }
    }

    if (amount > 0) {
      fetchQR();
    }
  }, [amount, reference]);
  console.log(amount);
  if (loading) {
    return (
      <div className="w-full max-w-[240px] mx-auto p-6 text-center text-gray-500 border rounded-xl">
        Generating QR code...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[240px] mx-auto p-6 text-center text-red-500 border rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-[240px] mx-auto"
      dangerouslySetInnerHTML={{ __html: svgData }}
    />
  );
}
