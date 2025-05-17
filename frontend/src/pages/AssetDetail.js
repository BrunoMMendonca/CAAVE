import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockMarkets } from '../data/mockData';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AssetDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [amount, setAmount] = useState('');
  
  // Find the asset from mock data
  const asset = mockMarkets.find(market => market.id === id) || mockMarkets[0];
  
  // Chart data for asset price
  const priceChartData = {
    labels: ['1D', '2D', '3D', '4D', '5D', '6D', '7D'],
    datasets: [
      {
        label: 'Asset Price',
        data: [
          asset.priceUSD * 0.95, 
          asset.priceUSD * 0.97, 
          asset.priceUSD * 1.02, 
          asset.priceUSD * 1.01, 
          asset.priceUSD * 0.99, 
          asset.priceUSD * 1.03, 
          asset.priceUSD
        ],
        borderColor: '#2ebac6',
        backgroundColor: 'rgba(46, 186, 198, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  // Chart data for utilization
  const utilizationChartData = {
    labels: ['1D', '2D', '3D', '4D', '5D', '6D', '7D'],
    datasets: [
      {
        label: 'Utilization Rate',
        data: [45, 48, 52, 55, 58, 62, 60],
        borderColor: '#b6509e',
        backgroundColor: 'rgba(182, 80, 158, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const chartOptions = {
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

  // Calculate utilization rate
  const utilizationRate = Math.round((asset.totalBorrow / asset.totalSupply) * 100);
  
  const handleSupply = () => {
    // In a real app, this would call the contract to supply tokens
    console.log('Supplying', amount, asset.symbol);
    setShowSupplyModal(false);
    setAmount('');
  };
  
  const handleBorrow = () => {
    // In a real app, this would call the contract to borrow tokens
    console.log('Borrowing', amount, asset.symbol);
    setShowBorrowModal(false);
    setAmount('');
  };
  
  // Use max amount (demo only)
  const handleUseMax = () => {
    setAmount('1000');
  };
  
  return (
    <div className="container px-4 py-8">
      <div className="mb-6">
        <Link to="/markets" className="text-mediumText hover:text-lightText flex items-center">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Markets
        </Link>
      </div>
      
      <div className="card mb-8">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center">
            <img 
              src={asset.icon} 
              alt={asset.name} 
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-lightText">{asset.name}</h1>
              <p className="text-mediumText">{asset.symbol}</p>
            </div>
            <div className="ml-auto flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="gradient-button px-6 py-2 rounded-lg text-white font-medium"
                onClick={() => setShowSupplyModal(true)}
              >
                Supply
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary hover:bg-opacity-90 px-6 py-2 rounded-lg text-white font-medium"
                onClick={() => setShowBorrowModal(true)}
              >
                Borrow
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="bg-darkerBlue py-3 px-6 border-b border-gray-800">
          <div className="flex overflow-x-auto">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-mediumText hover:text-lightText'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-mediumText hover:text-lightText'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-mediumText hover:text-lightText'}`}
              onClick={() => setActiveTab('history')}
            >
              Interest Rate History
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-darkBlue p-4 rounded-lg">
                  <h3 className="text-mediumText mb-1">Price</h3>
                  <p className="text-2xl font-semibold text-lightText">${asset.priceUSD.toLocaleString()}</p>
                </div>
                
                <div className="bg-darkBlue p-4 rounded-lg">
                  <h3 className="text-mediumText mb-1">Market Liquidity</h3>
                  <p className="text-2xl font-semibold text-lightText">
                    {(asset.totalSupply - asset.totalBorrow).toLocaleString()} {asset.symbol}
                  </p>
                </div>
                
                <div className="bg-darkBlue p-4 rounded-lg">
                  <h3 className="text-mediumText mb-1">Utilization Rate</h3>
                  <p className="text-2xl font-semibold text-lightText">{utilizationRate}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-lightText mb-4">Asset Price</h3>
                  <div className="h-64">
                    <Line data={priceChartData} options={chartOptions} />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-lightText mb-4">Utilization Rate</h3>
                  <div className="h-64">
                    <Line data={utilizationChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-lightText mb-4">Supply Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-mediumText">Supply APY</span>
                      <span className="text-primary font-medium">{asset.supplyAPY}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Total Supplied</span>
                      <span className="text-lightText font-medium">
                        {asset.totalSupply.toLocaleString()} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Your Supply</span>
                      <span className="text-lightText font-medium">
                        {asset.yourSupply || 0} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Deposit Limit</span>
                      <span className="text-lightText font-medium">
                        {(asset.totalSupply * 2).toLocaleString()} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Can be Collateral</span>
                      <span className="text-green-500 font-medium">
                        Yes
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-lightText mb-4">Borrow Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-mediumText">Borrow APY</span>
                      <span className="text-secondary font-medium">{asset.borrowAPY}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Total Borrowed</span>
                      <span className="text-lightText font-medium">
                        {asset.totalBorrow.toLocaleString()} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Your Borrow</span>
                      <span className="text-lightText font-medium">
                        {asset.yourBorrow || 0} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Available to Borrow</span>
                      <span className="text-lightText font-medium">
                        {(asset.totalSupply - asset.totalBorrow).toLocaleString()} {asset.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Liquidation Threshold</span>
                      <span className="text-lightText font-medium">
                        80%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-lightText mb-4">Asset Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-mediumText">Asset Contract</span>
                      <a 
                        href="#" 
                        className="text-primary font-medium truncate max-w-xs hover:underline"
                      >
                        0x1234...5678
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Reserve Factor</span>
                      <span className="text-lightText font-medium">
                        20%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Loan to Value</span>
                      <span className="text-lightText font-medium">
                        75%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Liquidation Penalty</span>
                      <span className="text-lightText font-medium">
                        5%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Optimal Utilization</span>
                      <span className="text-lightText font-medium">
                        80%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-lightText mb-4">Interest Rate Model</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-mediumText">Base Rate</span>
                      <span className="text-lightText font-medium">
                        1%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Rate Slope 1</span>
                      <span className="text-lightText font-medium">
                        4%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Rate Slope 2</span>
                      <span className="text-lightText font-medium">
                        60%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Optimal Utilization Rate</span>
                      <span className="text-lightText font-medium">
                        80%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-mediumText">Model Type</span>
                      <span className="text-lightText font-medium">
                        Two-slope
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <div className="h-80">
                <Line 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Supply APY',
                        data: [2.5, 2.7, 3.0, 3.2, 3.0, 2.8, 3.1, 3.3, 3.5, 3.4, 3.2, 3.3],
                        borderColor: '#2ebac6',
                        backgroundColor: 'rgba(46, 186, 198, 0.1)',
                        tension: 0.4,
                        fill: true,
                      },
                      {
                        label: 'Borrow APY',
                        data: [4.2, 4.5, 4.9, 5.0, 4.8, 4.7, 5.1, 5.3, 5.6, 5.5, 5.3, 5.4],
                        borderColor: '#b6509e',
                        backgroundColor: 'rgba(182, 80, 158, 0.1)',
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }} 
                  options={chartOptions} 
                />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-lightText mb-4">Interest Rate History</h3>
                <p className="text-mediumText mb-4">
                  The chart above shows historical interest rates for this asset over the past 12 months.
                  Supply and borrow interest rates change based on market conditions and utilization of the asset.
                </p>
                <p className="text-mediumText">
                  The utilization rate is the primary factor affecting the interest rates. When utilization is high,
                  borrow rates increase to incentivize repayments and attract new suppliers.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Supply Modal */}
      {showSupplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-lightText">Supply {asset.name}</h3>
              <button 
                className="text-mediumText hover:text-lightText"
                onClick={() => setShowSupplyModal(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Amount</span>
                <span className="text-mediumText">
                  Balance: 1000 {asset.symbol}
                  <button 
                    className="ml-2 text-primary text-xs hover:underline"
                    onClick={handleUseMax}
                  >
                    MAX
                  </button>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-darkerBlue text-lightText rounded-lg px-4 py-3 border border-gray-700 focus:border-primary focus:outline-none"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-3 flex items-center space-x-2">
                  <img 
                    src={asset.icon} 
                    alt={asset.name} 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-lightText font-medium">{asset.symbol}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-darkerBlue rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Supply APY</span>
                <span className="text-primary font-medium">{asset.supplyAPY}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Collateralization</span>
                <span className="text-green-500 font-medium">Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mediumText">Health Factor</span>
                <span className="text-green-500 font-medium">∞</span>
              </div>
            </div>
            
            <button 
              className="w-full gradient-button py-3 rounded-lg text-white font-medium"
              onClick={handleSupply}
              disabled={!amount}
            >
              Supply {asset.symbol}
            </button>
          </div>
        </div>
      )}
      
      {/* Borrow Modal */}
      {showBorrowModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-lightText">Borrow {asset.name}</h3>
              <button 
                className="text-mediumText hover:text-lightText"
                onClick={() => setShowBorrowModal(false)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Amount</span>
                <span className="text-mediumText">
                  Available: {(asset.totalSupply - asset.totalBorrow).toLocaleString()} {asset.symbol}
                  <button 
                    className="ml-2 text-primary text-xs hover:underline"
                    onClick={handleUseMax}
                  >
                    MAX
                  </button>
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-darkerBlue text-lightText rounded-lg px-4 py-3 border border-gray-700 focus:border-secondary focus:outline-none"
                  placeholder="0.00"
                />
                <div className="absolute right-3 top-3 flex items-center space-x-2">
                  <img 
                    src={asset.icon} 
                    alt={asset.name} 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-lightText font-medium">{asset.symbol}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-darkerBlue rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Borrow APY</span>
                <span className="text-secondary font-medium">{asset.borrowAPY}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Health Factor After</span>
                <span className="text-yellow-500 font-medium">1.8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mediumText">Liquidation at</span>
                <span className="text-mediumText font-medium">${asset.priceUSD * 0.8}</span>
              </div>
            </div>
            
            <button 
              className="w-full bg-secondary hover:bg-opacity-90 py-3 rounded-lg text-white font-medium"
              onClick={handleBorrow}
              disabled={!amount}
            >
              Borrow {asset.symbol}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetail;
