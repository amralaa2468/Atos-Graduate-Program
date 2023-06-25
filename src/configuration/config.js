import { Kafka } from "kafkajs";

export default function createKafkaConfig() {
  const kafka = new Kafka({
    clientId: "nodejs-kafka",
    brokers: ["localhost:9092"],
  });
  const producer = kafka.producer();

  async function produce(topic, messages) {
    try {
      await producer.connect();
      await producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (err) {
      console.log(err);
    } finally {
      await producer.disconnect();
    }
  }

  return {
    produce,
  };
}
