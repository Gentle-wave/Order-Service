import * as inventoryService from '../../services/inventory.service';
import axios from 'axios';

jest.mock('axios');

describe('Inventory Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch stock details from the inventory service', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: { stock: 10 } });

    const stock = await inventoryService.getStock('67501f294adcdc92109aa436');

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.INVENTORY_SERVICE_URL}/api/items/stock/67501f294adcdc92109aa436`
    );
    expect(stock).toBe(10);
  });

  it('should update stock in the inventory service', async () => {
    jest.spyOn(axios, 'patch').mockResolvedValue({});

    await inventoryService.updateStock('67501f294adcdc92109aa436', 8);

    expect(axios.patch).toHaveBeenCalledWith(
      `${process.env.INVENTORY_SERVICE_URL}/api/items/update-stock/67501f294adcdc92109aa436`,
      { stock: 8 }
    );
  });

  it('should throw an error if fetching stock fails', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue(new Error('Service unavailable'));

    await expect(inventoryService.getStock('67501f294adcdc92109aa436')).rejects.toThrow('Service unavailable');

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.INVENTORY_SERVICE_URL}/api/items/stock/67501f294adcdc92109aa436`
    );
  });

  it('should throw an error if updating stock fails', async () => {
    jest.spyOn(axios, 'patch').mockRejectedValue(new Error('Service unavailable'));

    await expect(
      inventoryService.updateStock('67501f294adcdc92109aa436', 8)
    ).rejects.toThrow('Service unavailable');

    expect(axios.patch).toHaveBeenCalledWith(
      `${process.env.INVENTORY_SERVICE_URL}/api/items/update-stock/67501f294adcdc92109aa436`,
      { stock: 8 }
    );
  });
});
