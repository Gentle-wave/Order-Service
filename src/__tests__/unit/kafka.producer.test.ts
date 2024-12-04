import { publishEvent } from '../../utils/kafka.producer';
import { kafkaProducer } from '../../config/kafka';

jest.mock('../../config/kafka');

describe('Kafka Producer', () => {
  it('should publish an event to Kafka successfully', async () => {
    // Mock Kafka producer's send method
    kafkaProducer.send = jest.fn().mockResolvedValue(undefined);

    const message = { event: 'ORDER_CREATED', orderId: '675022d6b25173ce96ed3121' };

    // Call the publishEvent function
    await publishEvent('order-events', message);

    // Validate that the Kafka producer's send method was called with the correct arguments
    expect(kafkaProducer.send).toHaveBeenCalledWith({
      topic: 'order-events',
      messages: [{ value: JSON.stringify(message) }],
    });
  });

  it('should handle errors when Kafka publishing fails', async () => {
    // Mock Kafka producer's send method to throw an error
    kafkaProducer.send = jest.fn().mockRejectedValue(new Error('Kafka send failed'));

    const message = { event: 'ORDER_CREATED', orderId: '675022d6b25173ce96ed3121' };

    // Expect the publishEvent function to throw the same error
    await expect(publishEvent('order-events', message)).rejects.toThrow('Kafka send failed');

    // Validate that the Kafka producer's send method was called with the correct arguments
    expect(kafkaProducer.send).toHaveBeenCalledWith({
      topic: 'order-events',
      messages: [{ value: JSON.stringify(message) }],
    });
  });
});
