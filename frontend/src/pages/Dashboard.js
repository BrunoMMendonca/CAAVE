import React from 'react';
import { motion } from 'framer-motion';
import AssetCard from '../components/AssetCard';
import { Link } from 'react-router-dom';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title 
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useMarkets } from '../context/MarketContext';
import { useUser } from '../context/UserContext';
import MarketRecommendations from '../components/MarketRecommendations';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
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
  
  // Mock user data for now - in a real app you'd get this from the API
  const yourSupplies = [];
  const yourBorrows = [];
  
  // Calculate totals
  const netWorthUSD = yourSupplies.reduce((total, asset) => 
    total + parseFloat(asset.amount_usd || 0), 0);
  
  const totalBorrowedUSD = yourBorrows.reduce((total, asset) => 
    total + parseFloat(asset.amount_usd || 0), 0);
  
  const availableToBorrowUSD = netWorthUSD * 0.8 - totalBorrowedUSD;
  
  // Chart data for portfolio
  const portfolioData = {
    labels: ['Supplied', 'Borrowed'],
    datasets: [
      {
        data: [netWorthUSD, totalBorrowedUSD],
        backgroundColor: ['#2ebac6', '#b6509e'],
        borderColor: ['transparent', 'transparent'],
        borderWidth: 1,
        cutout: '70%',
      },
    ],
  };
  
  // Chart data for health factor
  const healthFactor = totalBorrowedUSD > 0 
    ? (netWorthUSD * 0.8 / totalBorrowedUSD).toFixed(2) 
    : '∞';
  
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
  
  const marketTrendOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#a5a8b6',
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#a5a8b6',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#a5a8b6',
        },
        grid: {
          display: false,
        },
      },
    },
  };
  
  // Get wallet info from localStorage if available
  const getWalletInfo = () => {
    try {
      const walletInfoStr = localStorage.getItem('walletInfo');
      if (walletInfoStr) {
        return JSON.parse(walletInfoStr);
      }
    } catch (e) {
      console.error('Error parsing wallet info:', e);
    }
    return null;
  };

  const walletInfo = getWalletInfo();
  const isWalletConnected = walletInfo && walletInfo.connected;

  return (
    <div className="container px-4 py-8">
      <div 
        className="card p-6 mb-10 relative overflow-hidden" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(27, 32, 52, 0.9), rgba(19, 23, 38, 0.9)), url(https://images.unsplash.com/photo-1639815188508-13f7370f664a)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-3 text-lightText">
            {isWalletConnected 
              ? `Welcome, ${walletInfo.displayAddress}` 
              : 'Welcome to AaveADA'}
          </h1>
          <p className="text-mediumText text-lg mb-6">
            The first decentralized lending protocol on Cardano blockchain.
            Deposit, borrow, and earn interest on crypto assets.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/markets" 
              className="gradient-button px-6 py-3 rounded-lg text-white font-medium"
            >
              Explore Markets
            </Link>
            {!isWalletConnected && (
              <button 
                onClick={() => document.querySelector('header button:last-child').click()}
                className="bg-darkBlue px-6 py-3 rounded-lg text-lightText font-medium border border-gray-700 hover:border-primary"
              >
                Connect Wallet
              </button>
            )}
            <a 
              href="https://docs.aave.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-darkBlue px-6 py-3 rounded-lg text-lightText font-medium border border-gray-700 hover:border-primary"
            >
              Read Docs
            </a>
          </div>
        </div>
      </div>

      {(yourSupplies.length > 0 || yourBorrows.length > 0) ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-lightText mb-4">Your Supplies</h3>
                {yourSupplies.length > 0 ? (
                  <div className="space-y-4">
                    {yourSupplies.map(asset => (
                      <div key={asset.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img 
                            src={asset.icon} 
                            alt={asset.name} 
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium text-lightText">{asset.name}</div>
                            <div className="text-sm text-mediumText">{asset.yourSupply} {asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lightText">${(asset.yourSupply * asset.priceUSD).toLocaleString()}</div>
                          <div className="text-sm text-primary">{asset.supplyAPY}% APY</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-mediumText mb-4">You don't have any supplies yet</p>
                    <Link 
                      to="/markets" 
                      className="gradient-button px-4 py-2 rounded-lg text-white font-medium inline-block"
                    >
                      Supply Now
                    </Link>
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-lightText mb-4">Your Borrows</h3>
                {yourBorrows.length > 0 ? (
                  <div className="space-y-4">
                    {yourBorrows.map(asset => (
                      <div key={asset.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img 
                            src={asset.icon} 
                            alt={asset.name} 
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div>
                            <div className="font-medium text-lightText">{asset.name}</div>
                            <div className="text-sm text-mediumText">{asset.yourBorrow} {asset.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lightText">${(asset.yourBorrow * asset.priceUSD).toLocaleString()}</div>
                          <div className="text-sm text-secondary">{asset.borrowAPY}% APY</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-mediumText mb-4">You don't have any borrows yet</p>
                    <Link 
                      to="/markets" 
                      className="bg-secondary px-4 py-2 rounded-lg text-white font-medium inline-block hover:bg-opacity-90"
                    >
                      Borrow Now
                    </Link>
                  </div>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card p-6 md:col-span-2"
              >
                <h3 className="text-lg font-semibold text-lightText mb-4">Market Trends</h3>
                <div className="h-64">
                  <Line data={marketTrendData} options={marketTrendOptions} />
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-lightText mb-6">Your Portfolio</h3>
            <div className="relative flex flex-col items-center mb-6">
              <div className="w-48 h-48 mb-4">
                <Doughnut data={portfolioData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-lightText">${netWorthUSD.toLocaleString()}</div>
                <div className="text-mediumText text-sm">Net Worth</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
                  <span className="text-mediumText">Supplied</span>
                </div>
                <span className="text-lightText font-medium">${netWorthUSD.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-secondary mr-3"></div>
                  <span className="text-mediumText">Borrowed</span>
                </div>
                <span className="text-lightText font-medium">${totalBorrowedUSD.toLocaleString()}</span>
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
    </div>
  );
};

export default Dashboard;
