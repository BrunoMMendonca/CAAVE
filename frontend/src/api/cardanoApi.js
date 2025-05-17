import apiClient from './apiClient';

export const cardanoApi = {
  // Get network info
  getNetworkInfo: async () => {
    const response = await apiClient.get('/cardano/info');
    return response.data;
  },
  
  // Get address info
  getAddressInfo: async (address) => {
    const response = await apiClient.get(`/cardano/address/${address}`);
    return response.data;
  },
  
  // Get transaction info
  getTransactionInfo: async (txHash) => {
    const response = await apiClient.get(`/cardano/transaction/${txHash}`);
    return response.data;
  },
  
  // Get asset info
  getAssetInfo: async (asset) => {
    const response = await apiClient.get(`/cardano/asset/${asset}`);
    return response.data;
  },
  
  // Get protocol parameters
  getParameters: async () => {
    const response = await apiClient.get('/cardano/parameters');
    return response.data;
  },
  
  // Get stake pools
  getPools: async (limit = 10) => {
    const response = await apiClient.get(`/cardano/pools?limit=${limit}`);
    return response.data;
  },
  
  // Get tokens
  getTokens: async (limit = 10) => {
    const response = await apiClient.get(`/cardano/tokens?limit=${limit}`);
    return response.data;
  },
};
