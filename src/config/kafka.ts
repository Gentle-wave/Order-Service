import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({ groupId: 'order-service-group' });

export const connectKafka = async (): Promise<void> => {
  try {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    console.log('✅ Kafka connected successfully');
  } catch (error) {
    console.error('❌ Kafka connection failed:', error);
    process.exit(1);
  }
};
