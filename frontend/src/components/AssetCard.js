import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AssetCard = ({ asset, type }) => {
  const navigate = useNavigate();
  const isSupply = type === 'supply';
  
  const handleCardClick = () => {
    navigate(`/asset/${asset.id}`);
  };
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card hover-card p-6 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center mb-4">
        <img 
          src={asset.icon} 
          alt={asset.name}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="text-lg font-semibold text-lightText">{asset.name}</h3>
          <p className="text-mediumText text-sm">{asset.symbol}</p>
        </div>
        <div className={`ml-auto px-2 py-1 rounded text-xs font-medium ${isSupply ? 'bg-primary bg-opacity-20 text-primary' : 'bg-secondary bg-opacity-20 text-secondary'}`}>
          {isSupply ? 'Supply' : 'Borrow'}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-mediumText text-sm">
            {isSupply ? 'Supply APY' : 'Borrow APY'}
          </span>
          <span className="text-lightText font-medium">
            {isSupply ? asset.supplyAPY : asset.borrowAPY}%
          </span>
        </div>
        
        {!isSupply && (
          <div className="flex justify-between mb-1">
            <span className="text-mediumText text-sm">
              Available to borrow
            </span>
            <span className="text-lightText font-medium">
              {asset.availableToBorrow} {asset.symbol}
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-mediumText text-sm">
            {isSupply ? 'Your supply' : 'Your borrow'}
          </span>
          <span className="text-lightText font-medium">
            {isSupply ? asset.yourSupply : asset.yourBorrow} {asset.symbol}
          </span>
        </div>
      </div>
      
      <button 
        className={`w-full py-2 rounded-lg text-white font-medium ${
          isSupply 
            ? 'bg-primary hover:bg-opacity-90' 
            : 'bg-secondary hover:bg-opacity-90'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/asset/${asset.id}`);
        }}
      >
        {isSupply ? 'Supply' : 'Borrow'}
      </button>
    </motion.div>
  );
};

export default AssetCard;
