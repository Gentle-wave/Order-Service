import { EachMessagePayload, Kafka } from 'kafkajs';
import Log from '../models/log.model';

export const kafkaConsumer = (kafka: Kafka) => {
  const consumer = kafka.consumer({ groupId: 'order-service-group' });

  const run = async () => {
    await consumer.subscribe({ topic: 'stock-updates', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        try {
          const event = JSON.parse(message.value?.toString() || '{}');
          console.log(`📥 Received stock update event:`, event);

          // Save the event to the log table
          await Log.create({ event: 'STOCK_UPDATED', payload: event });
        } catch (error: any) {
          console.error('❌ Error processing stock update event:', error.message);
        }
      },
    });
  };

  return { run };
};
