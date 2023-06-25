import { Kafka } from "kafkajs";

export default function createKafkaConfig() {
  const kafka = new Kafka({
    clientId: "nodejs-kafka",
    brokers: ["localhost:9092"],
  });
  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "test-group" });

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

  async function consume(topic, callback) {
    try {
      await consumer.connect();
      await consumer.subscribe({ topic: topic, fromBeginning: true });
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  return {
    produce,
    consume,
  };
}
