import { kafka } from "./kafkaClient";

const consumer = kafka.consumer({ groupId: "slip-verified-consumer" });

export async function startSlipVerifiedConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "slip-verified", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        value: message.value?.toString(),
      });
    },
  });
}
