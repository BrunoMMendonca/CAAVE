import React, { useState } from 'react';
import MarketTable from '../components/MarketTable';
import { useMarkets } from '../context/MarketContext';

const Markets = () => {
  const { markets, loading, error } = useMarkets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-lightText">Loading markets...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    console.error("Error loading markets:", error);
  }
  
  const filteredMarkets = markets.filter(market => {
    // Apply search filter
    const matchesSearch = market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          market.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'stablecoins') {
      const stablecoins = ['DJED', 'iUSD', 'USDA', 'USDC', 'USDT'];
      return matchesSearch && stablecoins.includes(market.symbol);
    }
    if (filterType === 'crypto') {
      const stablecoins = ['DJED', 'iUSD', 'USDA', 'USDC', 'USDT'];
      return matchesSearch && !stablecoins.includes(market.symbol);
    }
    
    return matchesSearch;
  });
  
  // Calculate totals
  const totalMarketSize = markets.reduce((total, market) => total + parseFloat(market.total_supply_usd || 0), 0);
  const totalBorrowed = markets.reduce((total, market) => total + parseFloat(market.total_borrow_usd || 0), 0);
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-lightText">Markets</h1>
        
        <div className="flex space-x-4">
          <select 
            className="bg-darkBlue text-mediumText rounded-md px-3 py-2 border border-gray-700"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Assets</option>
            <option value="stablecoins">Stablecoins</option>
            <option value="crypto">Cryptocurrencies</option>
          </select>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search markets..."
              className="bg-darkBlue text-mediumText rounded-md pl-10 pr-4 py-2 border border-gray-700 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-mediumText" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-lg text-mediumText mb-2">Total Market Size</h3>
          <p className="text-3xl font-bold text-lightText">${totalMarketSize.toLocaleString()}</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg text-mediumText mb-2">Total Value Borrowed</h3>
          <p className="text-3xl font-bold text-lightText">${totalBorrowed.toLocaleString()}</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg text-mediumText mb-2">Total Assets</h3>
          <p className="text-3xl font-bold text-lightText">{markets.length}</p>
        </div>
      </div>
      
      {filteredMarkets.length > 0 ? (
        <MarketTable markets={filteredMarkets} title="All Markets" />
      ) : (
        <div className="card p-6 text-center mb-8">
          <p className="text-mediumText">No markets found matching your search.</p>
        </div>
      )}
      
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-lightText mb-4">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">1</div>
              <h4 className="text-lightText font-medium">Supply</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Supply your assets to the protocol to earn interest and use them as collateral.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-3">2</div>
              <h4 className="text-lightText font-medium">Borrow</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Use your supplied assets as collateral to borrow other assets from the protocol.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-accentTeal flex items-center justify-center text-white mr-3">3</div>
              <h4 className="text-lightText font-medium">Repay &amp; Withdraw</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Repay your borrowed assets at any time to withdraw your supplied collateral.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-lightText mb-4">Risks</h3>
        <div className="space-y-4">
          <div className="flex">
            <div className="mr-4 text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lightText font-medium mb-1">Liquidation Risk</h4>
              <p className="text-mediumText text-sm">
                If your Health Factor goes below 1, your collateral may be liquidated to repay your borrowed assets.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h4 className="text-lightText font-medium mb-1">Market Risk</h4>
              <p className="text-mediumText text-sm">
                Cryptocurrency markets are volatile. A rapid price drop of your collateral asset may lead to liquidation.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="mr-4 text-yellow-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lightText font-medium mb-1">Smart Contract Risk</h4>
              <p className="text-mediumText text-sm">
                Using the protocol involves smart contract risk. While the protocol is audited, no code is perfect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
