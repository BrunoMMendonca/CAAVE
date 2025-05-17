import React from 'react';
import { motion } from 'framer-motion';
import { getAvailableWallets } from '../utils/wallet';

const WalletModal = ({ onClose, onSelectWallet }) => {
  const availableWallets = getAvailableWallets();
  
  const walletInfo = {
    nami: {
      name: 'Nami',
      icon: 'https://namiwallet.io/favicon.ico',
      description: 'Nami is a browser based wallet extension for the Cardano blockchain.',
    },
    eternl: {
      name: 'Eternl',
      icon: 'https://eternl.io/icons/favicon-32x32.png',
      description: 'Eternl (formerly ccvault.io) is a full-featured Cardano light wallet.',
    },
    flint: {
      name: 'Flint',
      icon: 'https://flint-wallet.com/apple-touch-icon.png',
      description: 'Flint Wallet is a user-friendly, non-custodial wallet for Cardano.',
    },
    typhon: {
      name: 'Typhon',
      icon: 'https://typhonwallet.io/icons/apple-icon-76x76.png',
      description: 'Typhon is a web-based Cardano wallet with a built-in dApp connector.',
    },
    nufi: {
      name: 'NuFi',
      icon: 'https://nu.fi/favicon-32x32.png',
      description: 'NuFi is a browser-based wallet for Cardano and other blockchains.',
    },
    yoroi: {
      name: 'Yoroi',
      icon: 'https://yoroi-wallet.com/favicon-32x32.png',
      description: 'Yoroi is a light wallet for Cardano developed by Emurgo.',
    },
    gerowallet: {
      name: 'GeroWallet',
      icon: 'https://gerowallet.io/assets/img/logo2.svg',
      description: 'GeroWallet is a Cardano wallet focused on DeFi and dApps.',
    },
    cardwallet: {
      name: 'CardWallet',
      icon: 'https://cardwallet.fi/assets/logo-icon.png',
      description: 'CardWallet is a secure and user-friendly Cardano wallet.',
    },
  };

  const handleWalletSelect = (walletName) => {
    onSelectWallet(walletName);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="modal-content max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-lightText">Connect Wallet</h3>
          <button 
            className="text-mediumText hover:text-lightText"
            onClick={onClose}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {availableWallets.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-mediumText mb-4">No Cardano wallets detected</p>
            <p className="text-sm text-mediumText mb-6">
              Please install one of the supported Cardano wallet extensions: Nami, Eternl, Flint, Typhon, or others.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://namiwallet.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get Nami
              </a>
              <a 
                href="https://eternl.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get Eternl
              </a>
              <a 
                href="https://flint-wallet.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get Flint
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {availableWallets.map((walletName) => (
              <button
                key={walletName}
                className="w-full flex items-center p-4 bg-darkBlue rounded-lg hover:bg-opacity-80 transition-colors border border-gray-700 hover:border-primary"
                onClick={() => handleWalletSelect(walletName)}
              >
                <img 
                  src={walletInfo[walletName]?.icon || `https://via.placeholder.com/32?text=${walletName[0]}`} 
                  alt={walletInfo[walletName]?.name || walletName} 
                  className="w-8 h-8 rounded-full mr-4"
                />
                <div className="text-left">
                  <div className="font-medium text-lightText">{walletInfo[walletName]?.name || walletName}</div>
                  <div className="text-sm text-mediumText">{walletInfo[walletName]?.description || `Connect to ${walletName}`}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-mediumText text-center">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletModal;
