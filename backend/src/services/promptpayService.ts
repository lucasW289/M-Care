import QRCode from "qrcode";

const PROMPTPAY_ID = process.env.PROMPTPAY_ID || "0851021039";

export async function generatePromptPayQR(
  amount: number,
  reference?: string
): Promise<string> {
  const { default: generatePayload } = await import("promptpay-qr");
  const payload = generatePayload(PROMPTPAY_ID, { amount });

  // Generate SVG string from payload
  const svgString = await QRCode.toString(payload, { type: "svg" });

  return svgString;
}
