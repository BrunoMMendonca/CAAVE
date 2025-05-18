import apiClient from './apiClient';

export const marketApi = {
  // Get all markets
  getAllMarkets: async () => {
    const response = await apiClient.get('/markets');
    return response.data;
  },
  
  // Get market by ID
  getMarket: async (marketId) => {
    const response = await apiClient.get(`/markets/${marketId}`);
    return response.data;
  },
  
  // Get market overview statistics
  getMarketStats: async () => {
    const response = await apiClient.get('/markets/stats/overview');
    return response.data;
  },
  
  // Get market recommendations
  getMarketRecommendations: async () => {
    const response = await apiClient.get('/markets/recommendations');
    return response.data;
  },
};
