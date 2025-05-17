import React, { createContext, useState, useEffect, useContext } from 'react';
import { userApi } from '../api/userApi';

// Create the context
const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [userPosition, setUserPosition] = useState(null);
  const [addressInfo, setAddressInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user position when wallet address changes
  const fetchUserPosition = async (address) => {
    if (!address) {
      setUserPosition(null);
      setAddressInfo(null);
      return;
    }

    try {
      setLoading(true);
      const data = await userApi.getUserPosition(address);
      setUserPosition(data.position);
      setAddressInfo(data.address_info);
      setError(null);
    } catch (err) {
      console.error('Error fetching user position:', err);
      setError('Failed to fetch user position');
      // Don't clear existing data to avoid UI flashing
    } finally {
      setLoading(false);
    }
  };

  // Simulate supplying an asset
  const simulateSupply = async (address, assetId, amount) => {
    try {
      setLoading(true);
      const data = await userApi.simulateSupply(address, assetId, amount);
      return data;
    } catch (err) {
      console.error('Error simulating supply:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simulate borrowing an asset
  const simulateBorrow = async (address, assetId, amount) => {
    try {
      setLoading(true);
      const data = await userApi.simulateBorrow(address, assetId, amount);
      return data;
    } catch (err) {
      console.error('Error simulating borrow:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userPosition,
        addressInfo,
        loading,
        error,
        fetchUserPosition,
        simulateSupply,
        simulateBorrow,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
