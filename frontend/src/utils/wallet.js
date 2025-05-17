import { 
  CardanoWalletSelector, 
  WalletDisconnectedError 
} from '@cardano-foundation/cardano-connect-with-wallet';

// List of supported wallet names
export const SUPPORTED_WALLETS = [
  'nami',
  'eternl',
  'flint',
  'typhon',
  'nufi',
  'yoroi',
  'gerowallet',
  'cardwallet'
];

// Get available wallets from window.cardano
export const getAvailableWallets = () => {
  if (!window.cardano) {
    return [];
  }

  return SUPPORTED_WALLETS.filter(
    walletName => !!window.cardano[walletName]
  );
};

// Check if a specific wallet is available
export const isWalletAvailable = (walletName) => {
  if (!window.cardano) {
    return false;
  }
  
  return !!window.cardano[walletName];
};

// Connect to a wallet and get API
export const connectWallet = async (walletName) => {
  try {
    if (!isWalletAvailable(walletName)) {
      throw new Error(`${walletName} wallet is not available`);
    }

    const walletSelector = new CardanoWalletSelector();
    const wallet = await walletSelector.connect({
      walletName: walletName,
    });

    return wallet;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

// Disconnect from wallet
export const disconnectWallet = async (wallet) => {
  try {
    if (!wallet) {
      throw new WalletDisconnectedError('No wallet to disconnect');
    }
    
    await wallet.disconnect();
    return true;
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

// Get wallet balance
export const getWalletBalance = async (wallet) => {
  try {
    if (!wallet) {
      throw new WalletDisconnectedError('Wallet not connected');
    }

    const balance = await wallet.getBalance();
    return balance;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw error;
  }
};

// Get wallet address
export const getWalletAddress = async (wallet) => {
  try {
    if (!wallet) {
      throw new WalletDisconnectedError('Wallet not connected');
    }

    const addresses = await wallet.getUsedAddresses();
    return addresses[0] || null;
  } catch (error) {
    console.error('Error getting wallet address:', error);
    throw error;
  }
};

// Format wallet address for display (shorten it)
export const formatWalletAddress = (address) => {
  if (!address) return '';
  
  if (address.length <= 12) return address;
  
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 6
  )}`;
};

// Format ADA amount (convert from lovelace to ADA)
export const formatAdaAmount = (lovelaceAmount) => {
  if (!lovelaceAmount) return '0';
  
  // Convert lovelace (1/1,000,000 ADA) to ADA
  const adaAmount = parseInt(lovelaceAmount) / 1000000;
  
  // Format with commas for thousands
  return adaAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  });
};
