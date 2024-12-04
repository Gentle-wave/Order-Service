import { kafkaProducer } from '../config/kafka';

export const publishEvent = async (topic: string, message: object): Promise<void> => {
  try {
    const event = {
      value: JSON.stringify(message),
    };
    await kafkaProducer.send({
      topic,
      messages: [event],
    });
    console.log(`📤 Event published to topic "${topic}":`, message);
  } catch (error: any) {
    console.error('❌ Failed to publish event:', error.message);
    throw error;
  }
};
