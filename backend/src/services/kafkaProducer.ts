import { kafka } from "./kafkaClient";

const producer = kafka.producer();

export async function sendVerifySlip(message: string) {
  await producer.connect();
  await producer.send({
    topic: "verify-slip",
    messages: [{ value: message }],
  });
  console.log(`Message sent to verify-slip: ${message}`);
  await producer.disconnect();
}
