import React, { createContext, useState, useEffect, useContext } from 'react';
import { marketApi } from '../api/marketApi';
import { mockMarkets } from '../data/mockData'; // Fallback data

// Create the context
const MarketContext = createContext();

// Create the provider component
export const MarketProvider = ({ children }) => {
  const [markets, setMarkets] = useState([]);
  const [marketStats, setMarketStats] = useState(null);
  const [marketRecommendations, setMarketRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [recommendationsError, setRecommendationsError] = useState(null);

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

  // Fetch market statistics from the API
  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        setStatsLoading(true);
        const data = await marketApi.getMarketStats();
        setMarketStats(data);
        setStatsError(null);
      } catch (err) {
        console.error('Error fetching market stats:', err);
        setStatsError('Failed to fetch market statistics.');
        // No mock data fallback for stats
        setMarketStats({
          total_supply: 0,
          total_borrow: 0,
          markets_count: 0,
          avg_supply_rate: 0,
          avg_borrow_rate: 0,
          top_markets: []
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchMarketStats();
  }, []);
  
  // Fetch market recommendations from the API
  useEffect(() => {
    const fetchMarketRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const data = await marketApi.getMarketRecommendations();
        setMarketRecommendations(data);
        setRecommendationsError(null);
      } catch (err) {
        console.error('Error fetching market recommendations:', err);
        setRecommendationsError('Failed to fetch market recommendations.');
        // No mock data fallback for recommendations
        setMarketRecommendations({
          best_supply_opportunities: [],
          best_borrow_opportunities: [],
          safest_supply_markets: [],
          overall_recommendation: null
        });
      } finally {
        setRecommendationsLoading(false);
      }
    };

    fetchMarketRecommendations();
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

  // Format the market stats for display
  const formatMarketStats = (stats) => {
    if (!stats) return null;
    
    try {
      // Format numbers for display (billions/millions)
      const formatNumber = (num) => {
        if (num >= 1e9) {
          return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
          return (num / 1e6).toFixed(2) + 'M';
        } else {
          return num.toFixed(2);
        }
      };
      
      return {
        ...stats,
        formatted: {
          total_supply: formatNumber(stats.total_supply),
          total_borrow: formatNumber(stats.total_borrow),
          avg_supply_rate: stats.avg_supply_rate.toFixed(2) + '%',
          avg_borrow_rate: stats.avg_borrow_rate.toFixed(2) + '%',
        }
      };
    } catch (error) {
      console.error('Error formatting market stats:', error);
      return stats;
    }
  };

  return (
    <MarketContext.Provider
      value={{
        markets,
        loading,
        error,
        marketStats: marketStats ? formatMarketStats(marketStats) : null,
        statsLoading,
        statsError,
        marketRecommendations,
        recommendationsLoading,
        recommendationsError,
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
