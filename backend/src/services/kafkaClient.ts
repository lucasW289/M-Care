import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "mcare-backend",
  brokers: ["localhost:9093"], // Kafka UI external port
});
