import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

const Stake = () => {
  const [activeTab, setActiveTab] = useState('stake');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [amount, setAmount] = useState('');
  
  // Mock data for staking
  const stakingData = {
    balance: 5000,
    staked: 2500,
    rewards: 125.5,
    apr: 7.8,
    totalStaked: 15000000,
    epochsCompleted: 320,
    currentEpoch: 321,
  };
  
  // Chart data for staking distribution
  const stakingDistributionData = {
    labels: ['Your Stake', 'Other Stakers'],
    datasets: [
      {
        data: [stakingData.staked, stakingData.totalStaked - stakingData.staked],
        backgroundColor: ['#2ebac6', '#1b2034'],
        borderColor: ['transparent', 'transparent'],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart data for APR history
  const aprHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Staking APR',
        data: [7.2, 7.4, 7.6, 7.8, 8.0, 7.9, 7.7, 7.8, 7.7, 7.6, 7.7, 7.8],
        borderColor: '#2ebac6',
        backgroundColor: 'rgba(46, 186, 198, 0.1)',
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
  
  const handleStake = () => {
    // In a real app, this would call the staking contract
    console.log('Staking', amount, 'ADA');
    setShowStakeModal(false);
    setAmount('');
  };
  
  const handleUseMax = () => {
    setAmount(stakingData.balance.toString());
  };
  
  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-lightText">Stake</h1>
        
        <div className="flex space-x-4">
          <button 
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'stake' 
                ? 'gradient-button text-white' 
                : 'bg-darkBlue text-mediumText border border-gray-700 hover:text-lightText'
            }`}
            onClick={() => setActiveTab('stake')}
          >
            Stake
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'cooldown' 
                ? 'gradient-button text-white' 
                : 'bg-darkBlue text-mediumText border border-gray-700 hover:text-lightText'
            }`}
            onClick={() => setActiveTab('cooldown')}
          >
            Cooldown
          </button>
        </div>
      </div>
      
      <div 
        className="card p-6 mb-8 relative overflow-hidden" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(27, 32, 52, 0.9), rgba(19, 23, 38, 0.9)), url(https://images.unsplash.com/photo-1639815188508-13f7370f664a)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-lightText">Stake ADA and Earn Rewards</h2>
            <p className="text-mediumText mb-6">
              Stake your ADA to support the protocol's security and earn rewards.
              Staking helps secure the Cardano network while allowing you to earn passive income.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="gradient-button px-6 py-3 rounded-lg text-white font-medium"
              onClick={() => setShowStakeModal(true)}
            >
              Stake ADA
            </motion.button>
          </div>
          
          <div className="mt-6 md:mt-0">
            <div className="bg-darkBlue p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Current APR</span>
                <span className="text-primary text-2xl font-bold">{stakingData.apr}%</span>
              </div>
            </div>
            
            <div className="bg-darkBlue p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Your Staked ADA</span>
                <span className="text-lightText text-2xl font-bold">{stakingData.staked.toLocaleString()} ADA</span>
              </div>
            </div>
            
            <div className="bg-darkBlue p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Your Rewards</span>
                <span className="text-lightText text-2xl font-bold">{stakingData.rewards.toLocaleString()} ADA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="card p-6 h-full">
            <h3 className="text-lg font-semibold text-lightText mb-6">APR History</h3>
            <div className="h-64">
              <Line data={aprHistoryData} options={chartOptions} />
            </div>
            <div className="mt-6">
              <h4 className="text-lightText font-medium mb-2">Current Staking Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-darkBlue p-3 rounded-lg">
                  <div className="text-mediumText text-sm mb-1">Total Staked</div>
                  <div className="text-lightText font-medium">{stakingData.totalStaked.toLocaleString()} ADA</div>
                </div>
                <div className="bg-darkBlue p-3 rounded-lg">
                  <div className="text-mediumText text-sm mb-1">Current Epoch</div>
                  <div className="text-lightText font-medium">{stakingData.currentEpoch}</div>
                </div>
                <div className="bg-darkBlue p-3 rounded-lg">
                  <div className="text-mediumText text-sm mb-1">Epochs Completed</div>
                  <div className="text-lightText font-medium">{stakingData.epochsCompleted}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-lightText mb-6">Your Staking Overview</h3>
          <div className="relative flex flex-col items-center mb-6">
            <div className="w-48 h-48 mb-4">
              <Doughnut 
                data={stakingDistributionData} 
                options={{ 
                  cutout: '70%', 
                  plugins: { 
                    legend: { 
                      display: false 
                    } 
                  } 
                }} 
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold text-lightText">{((stakingData.staked / stakingData.totalStaked) * 100).toFixed(4)}%</div>
              <div className="text-mediumText text-sm">of Total Stake</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
              <span className="text-mediumText">Your Balance</span>
              <span className="text-lightText font-medium">{stakingData.balance.toLocaleString()} ADA</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
              <span className="text-mediumText">Your Stake</span>
              <span className="text-lightText font-medium">{stakingData.staked.toLocaleString()} ADA</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
              <span className="text-mediumText">Your Rewards</span>
              <span className="text-lightText font-medium">{stakingData.rewards.toLocaleString()} ADA</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-darkBlue rounded-lg">
              <span className="text-mediumText">Current APR</span>
              <span className="text-primary font-medium">{stakingData.apr}%</span>
            </div>
          </div>
          
          <div className="mt-6 space-x-3">
            <button 
              className="gradient-button px-5 py-2 rounded-lg text-white font-medium"
              onClick={() => setShowStakeModal(true)}
            >
              Stake More
            </button>
            <button className="bg-darkBlue text-mediumText border border-gray-700 hover:text-lightText px-5 py-2 rounded-lg font-medium">
              Claim Rewards
            </button>
          </div>
        </div>
      </div>
      
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-lightText mb-4">How Staking Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">1</div>
              <h4 className="text-lightText font-medium">Stake ADA</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Stake your ADA and become a part of the Cardano network security.
              Your stake delegates voting power to the protocol.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-3">2</div>
              <h4 className="text-lightText font-medium">Earn Rewards</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Receive staking rewards proportional to your stake amount.
              Rewards are distributed at the end of each epoch (5 days).
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-accentTeal flex items-center justify-center text-white mr-3">3</div>
              <h4 className="text-lightText font-medium">Unstake</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              When you want to withdraw, initiate the cooldown period
              and then unstake your ADA once the cooldown is complete.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-lightText mb-4">Staking FAQs</h3>
        <div className="space-y-4">
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">What is staking?</h4>
            <p className="text-mediumText text-sm">
              Staking is the process of participating in the Cardano network's consensus mechanism by delegating your ADA.
              This helps secure the network and in return, you earn rewards.
            </p>
          </div>
          
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">How are rewards calculated?</h4>
            <p className="text-mediumText text-sm">
              Rewards are calculated based on your stake amount, the total amount staked in the protocol,
              and the current APR. Rewards are distributed at the end of each epoch (approximately 5 days).
            </p>
          </div>
          
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">What is the cooldown period?</h4>
            <p className="text-mediumText text-sm">
              The cooldown period is a security measure that ensures the stability of the protocol.
              When you decide to unstake, you must wait for the cooldown period (10 days) to complete before withdrawing your ADA.
            </p>
          </div>
          
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">Is there a minimum amount to stake?</h4>
            <p className="text-mediumText text-sm">
              The minimum stake amount is 100 ADA. This ensures efficient processing and meaningful participation in the network.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stake Modal */}
      {showStakeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-lightText">Stake ADA</h3>
              <button 
                className="text-mediumText hover:text-lightText"
                onClick={() => setShowStakeModal(false)}
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
                  Balance: {stakingData.balance.toLocaleString()} ADA
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
                    src="https://images.unsplash.com/photo-1639768939489-025b90ba9f23" 
                    alt="ADA" 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-lightText font-medium">ADA</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-darkerBlue rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Current APR</span>
                <span className="text-primary font-medium">{stakingData.apr}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-mediumText">Reward Per Epoch</span>
                <span className="text-lightText font-medium">
                  {amount ? ((parseFloat(amount) * stakingData.apr / 100) / 73).toFixed(2) : '0.00'} ADA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-mediumText">Reward Per Year</span>
                <span className="text-lightText font-medium">
                  {amount ? ((parseFloat(amount) * stakingData.apr / 100)).toFixed(2) : '0.00'} ADA
                </span>
              </div>
            </div>
            
            <button 
              className="w-full gradient-button py-3 rounded-lg text-white font-medium"
              onClick={handleStake}
              disabled={!amount}
            >
              Stake ADA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stake;
