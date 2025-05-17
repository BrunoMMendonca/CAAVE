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
    
    // Convert string amounts to numbers for display
    return {
      ...market,
      totalSupply: parseInt(market.total_supply) / Math.pow(10, market.decimals),
      totalBorrow: parseInt(market.total_borrow) / Math.pow(10, market.decimals),
      liquidity: parseInt(market.liquidity) / Math.pow(10, market.decimals),
      // Add any other formatting needed
    };
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
