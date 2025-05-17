import React, { createContext, useState, useEffect, useContext } from 'react';
import { marketApi } from '../api/marketApi';
import { mockMarkets } from '../data/mockData'; // Fallback data

// Create the context
const MarketContext = createContext();

// Create the provider component
export const MarketProvider = ({ children }) => {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch markets from the API
  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const data = await marketApi.getAllMarkets();
        setMarkets(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching markets:', err);
        setError('Failed to fetch markets. Using mock data instead.');
        setMarkets(mockMarkets); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  // Get a single market by ID
  const getMarket = (id) => {
    return markets.find(market => market.id === id) || null;
  };

  // Format market data for display
  const formatMarketData = (market) => {
    if (!market) return null;
    
    try {
      // Calculate display values based on decimals
      const decimals = market.decimals || 0;
      const totalSupply = parseFloat(market.total_supply || '0') / Math.pow(10, decimals);
      const totalBorrow = parseFloat(market.total_borrow || '0') / Math.pow(10, decimals);
      const liquidity = parseFloat(market.liquidity || '0') / Math.pow(10, decimals);
      
      return {
        ...market,
        totalSupply,
        totalBorrow,
        liquidity
      };
    } catch (error) {
      console.error('Error formatting market data:', error);
      return market;
    }
  };

  return (
    <MarketContext.Provider
      value={{
        markets,
        loading,
        error,
        getMarket,
        formatMarketData,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

// Custom hook to use the market context
export const useMarkets = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarkets must be used within a MarketProvider');
  }
  return context;
};
