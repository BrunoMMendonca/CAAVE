import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketTable = ({ markets, title }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'total_supply_usd',
    direction: 'descending'
  });

  const sortedMarkets = [...markets].sort((a, b) => {
    // Handle sorting for different types of values
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Convert string numbers to numbers for comparison
    if (typeof aValue === 'string' && !isNaN(aValue)) {
      aValue = parseFloat(aValue);
    }
    if (typeof bValue === 'string' && !isNaN(bValue)) {
      bValue = parseFloat(bValue);
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (name) => {
    if (sortConfig.key !== name) return null;
    
    return sortConfig.direction === 'ascending' 
      ? ' ↑' 
      : ' ↓';
  };

  const handleRowClick = (asset) => {
    navigate(`/asset/${asset.id}`);
  };

  // Helper function to format values
  const formatValue = (value, decimals = 0) => {
    if (typeof value === 'string') {
      // Convert string to number but preserve decimal precision
      const number = parseFloat(value);
      if (isNaN(number)) return '0';
      return number.toLocaleString();
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return '0';
  };

  return (
    <div className="card overflow-hidden mb-8">
      <div className="bg-darkBlue border-b border-gray-800 px-6 py-4">
        <h3 className="text-lg font-semibold text-lightText">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-darkerBlue border-b border-gray-800">
              <th className="px-6 py-3 text-left text-xs font-medium text-mediumText uppercase tracking-wider">
                Asset
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('total_supply_usd')}
              >
                Total Supply{getSortIndicator('total_supply_usd')}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('supply_apy')}
              >
                Supply APY{getSortIndicator('supply_apy')}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('total_borrow_usd')}
              >
                Total Borrowed{getSortIndicator('total_borrow_usd')}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('borrow_apy')}
              >
                Borrow APY{getSortIndicator('borrow_apy')}
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedMarkets.map((market) => {
              // Calculate display values based on decimals
              const totalSupply = parseFloat(market.total_supply) / Math.pow(10, market.decimals);
              const totalBorrow = parseFloat(market.total_borrow) / Math.pow(10, market.decimals);
              
              return (
                <tr 
                  key={market.id} 
                  className="market-row hover:bg-darkBlue cursor-pointer transition-colors duration-150"
                  onClick={() => handleRowClick(market)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={market.logo_url} 
                        alt={market.name} 
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-lightText">{market.name}</div>
                        <div className="text-sm text-mediumText">{market.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lightText font-medium">{formatValue(totalSupply, 2)} {market.symbol}</div>
                    <div className="text-sm text-mediumText">${formatValue(market.total_supply_usd)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lightText font-medium">{market.supply_apy}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lightText font-medium">{formatValue(totalBorrow, 2)} {market.symbol}</div>
                    <div className="text-sm text-mediumText">${formatValue(market.total_borrow_usd)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lightText font-medium">{market.borrow_apy}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(market);
                      }}
                      className="text-primary hover:underline"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;
