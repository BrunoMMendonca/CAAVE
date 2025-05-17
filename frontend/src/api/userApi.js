import apiClient from './apiClient';

export const userApi = {
  // Get user position
  getUserPosition: async (address) => {
    const response = await apiClient.get(`/users/${address}`);
    return response.data;
  },
  
  // Simulate supplying an asset
  simulateSupply: async (address, assetId, amount) => {
    const response = await apiClient.post(`/users/simulate-supply/${address}/${assetId}/${amount}`);
    return response.data;
  },
  
  // Simulate borrowing an asset
  simulateBorrow: async (address, assetId, amount) => {
    const response = await apiClient.post(`/users/simulate-borrow/${address}/${assetId}/${amount}`);
    return response.data;
  },
};
