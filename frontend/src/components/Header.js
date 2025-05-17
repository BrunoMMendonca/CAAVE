import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleConnectWallet = () => {
    setIsConnected(!isConnected);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-darkerBlue z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <img 
                src="https://images.unsplash.com/photo-1631795822849-e30bd7bde9e1" 
                alt="AaveADA Logo" 
                className="h-10 w-10 object-contain mr-2"
              />
              <span className="text-2xl font-semibold text-lightText">AaveADA</span>
            </NavLink>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-primary border-b-2 border-primary pb-1 font-medium" 
                    : "text-mediumText hover:text-lightText font-medium"
                }
                end
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/markets" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-primary border-b-2 border-primary pb-1 font-medium" 
                    : "text-mediumText hover:text-lightText font-medium"
                }
              >
                Markets
              </NavLink>
              <NavLink 
                to="/stake" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-primary border-b-2 border-primary pb-1 font-medium" 
                    : "text-mediumText hover:text-lightText font-medium"
                }
              >
                Stake
              </NavLink>
              <NavLink 
                to="/governance" 
                className={({ isActive }) => 
                  isActive 
                    ? "text-primary border-b-2 border-primary pb-1 font-medium" 
                    : "text-mediumText hover:text-lightText font-medium"
                }
              >
                Governance
              </NavLink>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="mr-4 text-lightText">
              <select className="bg-darkBlue text-mediumText rounded-md px-3 py-2 border border-gray-700">
                <option value="cardano">Cardano Mainnet</option>
                <option value="testnet">Cardano Testnet</option>
              </select>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-lg font-medium ${
                isConnected 
                  ? 'bg-darkBlue text-primary border border-primary' 
                  : 'gradient-button text-white'
              }`}
              onClick={handleConnectWallet}
            >
              {isConnected ? 'addr1q9...7tzq' : 'Connect Wallet'}
            </motion.button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-mediumText hover:text-lightText p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-darkBlue border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md ${
                  isActive 
                    ? "bg-gradient-primary text-white" 
                    : "text-mediumText hover:bg-gray-800 hover:text-lightText"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
              end
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/markets" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md ${
                  isActive 
                    ? "bg-gradient-primary text-white" 
                    : "text-mediumText hover:bg-gray-800 hover:text-lightText"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Markets
            </NavLink>
            <NavLink 
              to="/stake" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md ${
                  isActive 
                    ? "bg-gradient-primary text-white" 
                    : "text-mediumText hover:bg-gray-800 hover:text-lightText"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Stake
            </NavLink>
            <NavLink 
              to="/governance" 
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md ${
                  isActive 
                    ? "bg-gradient-primary text-white" 
                    : "text-mediumText hover:bg-gray-800 hover:text-lightText"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Governance
            </NavLink>
            <div className="pt-4 pb-2">
              <select className="bg-darkBlue text-mediumText rounded-md px-3 py-2 border border-gray-700 w-full mb-3">
                <option value="cardano">Cardano Mainnet</option>
                <option value="testnet">Cardano Testnet</option>
              </select>
              <button
                className="w-full gradient-button text-white px-6 py-2 rounded-lg font-medium"
                onClick={() => {
                  handleConnectWallet();
                  setIsMenuOpen(false);
                }}
              >
                {isConnected ? 'addr1q9...7tzq' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
