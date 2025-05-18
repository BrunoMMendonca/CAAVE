import React from 'react';
import { Link } from 'react-router-dom';
import { useMarkets } from '../context/MarketContext';
import { useUser } from '../context/UserContext';
import AssetCard from '../components/AssetCard';
import MarketTable from '../components/MarketTable';
import WalletModal from '../components/WalletModal';
import MarketRecommendations from '../components/MarketRecommendations';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  // Get markets data
  const { 
    markets, 
    loading: marketsLoading, 
    marketStats, 
    statsLoading 
  } = useMarkets();
  const { userPosition, loading: userLoading } = useUser();
  
  if (marketsLoading || statsLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-lightText">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#A0B0C0',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: '#1D2330',
        titleFont: {
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          family: "'Inter', sans-serif"
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#A0B0C0',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#A0B0C0',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  // Chart data for market trends
  const marketTrendData = {
    labels: ['1D', '2D', '3D', '4D', '5D', '6D', '7D'],
    datasets: [
      {
        label: 'Total Supply',
        data: [
          marketStats ? marketStats.total_supply * 0.95 : 12000000,
          marketStats ? marketStats.total_supply * 0.96 : 12500000,
          marketStats ? marketStats.total_supply * 0.97 : 13100000,
          marketStats ? marketStats.total_supply * 0.98 : 13400000,
          marketStats ? marketStats.total_supply * 0.99 : 13700000,
          marketStats ? marketStats.total_supply * 0.995 : 14200000,
          marketStats ? marketStats.total_supply : 14800000,
        ],
        borderColor: '#2ebac6',
        backgroundColor: 'rgba(46, 186, 198, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Borrow',
        data: [
          marketStats ? marketStats.total_borrow * 0.95 : 6500000,
          marketStats ? marketStats.total_borrow * 0.96 : 6800000,
          marketStats ? marketStats.total_borrow * 0.97 : 7200000,
          marketStats ? marketStats.total_borrow * 0.98 : 7400000,
          marketStats ? marketStats.total_borrow * 0.99 : 7800000,
          marketStats ? marketStats.total_borrow * 0.995 : 8200000,
          marketStats ? marketStats.total_borrow : 8500000,
        ],
        borderColor: '#b6509e',
        backgroundColor: 'rgba(182, 80, 158, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // User position data for doughnut chart
  let userData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 0
    }]
  };

  // User wallet data
  const walletBalance = userPosition?.walletBalance || 0;
  const supplyBalance = userPosition?.supplyBalance || 0;
  const borrowBalance = userPosition?.borrowBalance || 0;
  const availableToBorrowUSD = userPosition?.availableToBorrowUSD || 0;
  const netWorth = walletBalance + supplyBalance - borrowBalance;
  const healthFactor = userPosition?.healthFactor || '∞';

  // Prepare chart data if user has position
  if (userPosition && (supplyBalance > 0 || borrowBalance > 0)) {
    const labels = [];
    const data = [];
    const colors = [];
    
    // Add supply data
    if (supplyBalance > 0) {
      labels.push('Supply');
      data.push(supplyBalance);
      colors.push('#2ebac6');
    }
    
    // Add wallet data
    if (walletBalance > 0) {
      labels.push('Wallet');
      data.push(walletBalance);
      colors.push('#33a0ff');
    }
    
    // Add borrow data (as negative)
    if (borrowBalance > 0) {
      labels.push('Borrow');
      data.push(borrowBalance);
      colors.push('#b6509e');
    }
    
    userData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    };
  }

  // Doughnut chart options
  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#A0B0C0',
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    cutout: '70%'
  };

  // Render
  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-lightText mb-8">Dashboard</h1>
      
      {/* User Position */}
      {userPosition ? (
        <div className="mb-10">
          <h2 className="section-title">Your Position</h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Chart */}
            <div className="card p-6 flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold text-lightText mb-4">Net Worth</h3>
              <div className="text-3xl font-bold text-primary mb-2">${netWorth.toLocaleString()}</div>
              
              <div className="w-full h-64 flex justify-center items-center">
                {(supplyBalance > 0 || borrowBalance > 0) ? (
                  <Doughnut data={userData} options={doughnutOptions} />
                ) : (
                  <div className="text-center text-mediumText">
                    <p>No active positions</p>
                    <p className="text-sm mt-2">Supply or borrow to see your position</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Supply & Borrow Overview */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-lightText mb-4">Supply & Borrow</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-darkBlue p-4 rounded-lg">
                  <div className="text-primary font-medium">Supply Balance</div>
                  <div className="text-2xl font-bold text-lightText mt-1">${supplyBalance.toLocaleString()}</div>
                </div>
                <div className="bg-darkBlue p-4 rounded-lg">
                  <div className="text-secondary font-medium">Borrow Balance</div>
                  <div className="text-2xl font-bold text-lightText mt-1">${borrowBalance.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-mediumText">Current LTV</span>
                  <span className="text-lightText font-medium">
                    {supplyBalance > 0 
                      ? ((borrowBalance / supplyBalance) * 100).toFixed(2) + '%'
                      : '0.00%'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-mediumText">APY from supply</span>
                  <span className="text-primary font-medium">
                    {userPosition.netAPY ? '+' + userPosition.supplyAPY.toFixed(2) + '%' : '0.00%'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-mediumText">APY from borrow</span>
                  <span className="text-secondary font-medium">
                    {userPosition.borrowAPY ? '-' + userPosition.borrowAPY.toFixed(2) + '%' : '0.00%'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-mediumText">Net APY</span>
                  <span className={`font-medium ${userPosition.netAPY >= 0 ? 'text-primary' : 'text-secondary'}`}>
                    {userPosition.netAPY 
                      ? (userPosition.netAPY > 0 ? '+' : '') + userPosition.netAPY.toFixed(2) + '%'
                      : '0.00%'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            {/* Position Details */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-lightText mb-4">Position Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
                  <span className="text-mediumText">Wallet Balance</span>
                  <span className="text-lightText font-medium">${walletBalance.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
                  <span className="text-mediumText">Available to Borrow</span>
                  <span className="text-lightText font-medium">${availableToBorrowUSD.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
                  <span className="text-mediumText">Health Factor</span>
                  <span className={`font-medium ${
                    healthFactor === '∞' || healthFactor > 2 
                      ? 'text-green-500' 
                      : healthFactor > 1.5 
                        ? 'text-yellow-500' 
                        : 'text-red-500'
                  }`}>
                    {healthFactor}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="card p-8 mb-10 text-center">
          <h2 className="text-2xl font-bold text-lightText mb-4">Connect your wallet to get started</h2>
          <p className="text-mediumText mb-6">Connect your Cardano wallet to start supplying and borrowing assets</p>
          <button 
            className="gradient-button px-6 py-3 rounded-lg text-white font-medium"
            onClick={() => document.querySelector('header button:last-child').click()}
          >
            Connect Wallet
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-lightText mb-4">Total Markets</h3>
          <div className="text-3xl font-bold text-primary">
            {marketStats ? marketStats.markets_count : 0}
          </div>
          <div className="text-sm text-mediumText mt-2">Active markets available</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-lightText mb-4">Total Supply</h3>
          <div className="text-3xl font-bold text-primary">
            {marketStats && marketStats.formatted ? marketStats.formatted.total_supply : '0'}
          </div>
          <div className="text-sm text-mediumText mt-2">Avg. APY: {marketStats && marketStats.formatted ? marketStats.formatted.avg_supply_rate : '0%'}</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-lightText mb-4">Total Borrow</h3>
          <div className="text-3xl font-bold text-secondary">
            {marketStats && marketStats.formatted ? marketStats.formatted.total_borrow : '0'}
          </div>
          <div className="text-sm text-mediumText mt-2">Avg. APY: {marketStats && marketStats.formatted ? marketStats.formatted.avg_borrow_rate : '0%'}</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-lightText mb-4">Utilization Rate</h3>
          <div className="text-3xl font-bold text-accentTeal">
            {marketStats ? (marketStats.total_borrow / marketStats.total_supply * 100).toFixed(2) + '%' : '0%'}
          </div>
          <div className="text-sm text-mediumText mt-2">Market efficiency</div>
        </motion.div>
      </div>
      
      <div className="mb-10">
        <h2 className="section-title">Top Markets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketStats && marketStats.top_markets && marketStats.top_markets.length > 0 
            ? marketStats.top_markets.map(topMarket => {
                const market = markets.find(m => m.id === topMarket.id);
                return market ? (
                  <AssetCard 
                    key={market.id} 
                    asset={market} 
                    type={Math.random() > 0.5 ? 'supply' : 'borrow'} 
                  />
                ) : null;
              })
            : markets.slice(0, 4).map(asset => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  type={Math.random() > 0.5 ? 'supply' : 'borrow'} 
                />
              ))
          }
        </div>
        <div className="mt-6 text-center">
          <Link 
            to="/markets" 
            className="inline-block border border-primary text-primary hover:bg-primary hover:bg-opacity-10 px-6 py-3 rounded-lg font-medium"
          >
            View All Markets
          </Link>
        </div>
      </div>
      
      {/* Market Recommendations */}
      <div className="mb-10">
        <h2 className="section-title">Smart Market Recommendations</h2>
        <MarketRecommendations />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="card p-6"
        >
          <div className="text-primary text-3xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-lightText mb-2">Supply</h3>
          <p className="text-mediumText mb-6">
            Earn interest on your digital assets by supplying to the protocol and use them as collateral.
          </p>
          <Link to="/markets" className="text-primary hover:underline font-medium">
            Supply Now →
          </Link>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="card p-6"
        >
          <div className="text-secondary text-3xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-lightText mb-2">Borrow</h3>
          <p className="text-mediumText mb-6">
            Get instant liquidity without selling your assets. Borrow a variety of available assets.
          </p>
          <Link to="/markets" className="text-secondary hover:underline font-medium">
            Borrow Now →
          </Link>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="card p-6"
        >
          <div className="text-accentTeal text-3xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-lightText mb-2">Stake</h3>
          <p className="text-mediumText mb-6">
            Stake ADA tokens and earn rewards while supporting the Cardano network's security.
          </p>
          <Link to="/stake" className="text-accentTeal hover:underline font-medium">
            Stake Now →
          </Link>
        </motion.div>
      </div>
      
      {/* Market Trends Chart */}
      <div className="mb-10">
        <h2 className="section-title">Market Trends</h2>
        <div className="card p-6">
          <div className="h-96">
            <Line options={chartOptions} data={marketTrendData} />
          </div>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="section-title">All Markets</h2>
        <MarketTable />
      </div>
    </div>
  );
};

export default Dashboard;