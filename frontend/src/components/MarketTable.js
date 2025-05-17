import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketTable = ({ markets, title }) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({
    key: 'totalSupply',
    direction: 'descending'
  });

  const sortedMarkets = [...markets].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
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
                onClick={() => requestSort('totalSupply')}
              >
                Total Supply{getSortIndicator('totalSupply')}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('supplyAPY')}
              >
                Supply APY{getSortIndicator('supplyAPY')}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('totalBorrow')}
              >
                Total Borrowed{getSortIndicator('totalBorrow')}
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-medium text-mediumText uppercase tracking-wider cursor-pointer hover:text-lightText"
                onClick={() => requestSort('borrowAPY')}
              >
                Borrow APY{getSortIndicator('borrowAPY')}
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedMarkets.map((market) => (
              <tr 
                key={market.id} 
                className="market-row hover:bg-darkBlue cursor-pointer transition-colors duration-150"
                onClick={() => handleRowClick(market)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={market.icon} 
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
                  <div className="text-lightText font-medium">{market.totalSupply.toLocaleString()} {market.symbol}</div>
                  <div className="text-sm text-mediumText">${market.totalSupplyUSD.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-lightText font-medium">{market.supplyAPY}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-lightText font-medium">{market.totalBorrow.toLocaleString()} {market.symbol}</div>
                  <div className="text-sm text-mediumText">${market.totalBorrowUSD.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-lightText font-medium">{market.borrowAPY}%</div>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;
