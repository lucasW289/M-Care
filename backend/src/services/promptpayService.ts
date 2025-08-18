import QRCode from "qrcode";

const PROMPTPAY_ID = process.env.PROMPTPAY_ID || "0851021039";

export async function generatePromptPayQR(
  amount: number,
  reference: string
): Promise<string> {
  if (!reference) {
    throw new Error("Reference is required for PromptPay QR generation");
  }

  const { default: generatePayload } = await import("promptpay-qr");

  const payload = generatePayload(PROMPTPAY_ID, {
    amount,
  });

  const svgString = await QRCode.toString(payload, { type: "svg" });

  return svgString;
}
