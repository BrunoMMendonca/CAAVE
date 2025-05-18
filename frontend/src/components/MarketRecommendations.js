import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMarkets } from '../context/MarketContext';

const OpportunityCard = ({ market, type, index }) => {
  const isSupply = type === 'supply';
  const isSafety = type === 'safety';
  
  const getBgColor = () => {
    if (isSupply) return 'bg-gradient-to-r from-teal-500/10 to-teal-600/5';
    if (isSafety) return 'bg-gradient-to-r from-blue-500/10 to-blue-600/5';
    return 'bg-gradient-to-r from-purple-500/10 to-purple-600/5';
  };
  
  const getBorderColor = () => {
    if (isSupply) return 'border-teal-500/30';
    if (isSafety) return 'border-blue-500/30';
    return 'border-purple-500/30';
  };
  
  const getIconClass = () => {
    if (isSupply) return 'text-teal-500';
    if (isSafety) return 'text-blue-500';
    return 'text-purple-500';
  };
  
  const getActionText = () => {
    if (isSupply) return 'Supply';
    if (isSafety) return 'Use as Collateral';
    return 'Borrow';
  };
  
  const getRate = () => {
    if (isSupply) return `${market.supply_apy}% APY`;
    if (isSafety) return `${(market.collateral_factor * 100).toFixed(0)}% CF`;
    return `${market.borrow_apy}% APY`;
  };
  
  const formatTokenAmount = (amount) => {
    // Format token amount for display (shortened for large numbers)
    const num = parseFloat(amount);
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`p-4 rounded-xl border ${getBorderColor()} ${getBgColor()} mb-3`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full bg-darkBg flex items-center justify-center mr-3 ${getIconClass()}`}>
            {isSupply && <i className="fas fa-arrow-up text-xs"></i>}
            {isSafety && <i className="fas fa-shield-alt text-xs"></i>}
            {!isSupply && !isSafety && <i className="fas fa-arrow-down text-xs"></i>}
          </div>
          <div>
            <div className="font-semibold">{market.name}</div>
            <div className="text-xs text-mediumText">{getRate()}</div>
          </div>
        </div>
        
        <Link 
          to={`/markets/${market.id}`} 
          className={`${isSupply ? 'bg-teal-500' : isSafety ? 'bg-blue-500' : 'bg-purple-500'} text-xs py-1 px-3 rounded-full text-white`}
        >
          {getActionText()}
        </Link>
      </div>
    </motion.div>
  );
};

const MarketRecommendations = () => {
  const { marketRecommendations, recommendationsLoading, recommendationsError } = useMarkets();
  
  if (recommendationsLoading) {
    return (
      <div className="card p-6 h-full">
        <h3 className="text-lg font-semibold text-lightText mb-4">Market Recommendations</h3>
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (recommendationsError || !marketRecommendations) {
    return (
      <div className="card p-6 h-full">
        <h3 className="text-lg font-semibold text-lightText mb-4">Market Recommendations</h3>
        <div className="text-mediumText">
          Unable to load market recommendations at this time.
        </div>
      </div>
    );
  }
  
  const { 
    best_supply_opportunities, 
    best_borrow_opportunities, 
    safest_supply_markets,
    overall_recommendation 
  } = marketRecommendations;
  
  return (
    <div className="card p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold text-lightText mb-1">Market Recommendations</h3>
      
      {overall_recommendation && (
        <div className="text-sm text-mediumText mb-4 border-l-2 border-accentTeal pl-2 italic">
          {overall_recommendation}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-md font-medium text-teal-500 mb-3">
            <i className="fas fa-arrow-up mr-2"></i>
            Best to Supply
          </h4>
          {best_supply_opportunities.length > 0 ? (
            best_supply_opportunities.map((market, idx) => (
              <OpportunityCard key={market.id} market={market} type="supply" index={idx} />
            ))
          ) : (
            <div className="text-sm text-mediumText">No supply opportunities available</div>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium text-purple-500 mb-3">
            <i className="fas fa-arrow-down mr-2"></i>
            Best to Borrow
          </h4>
          {best_borrow_opportunities.length > 0 ? (
            best_borrow_opportunities.map((market, idx) => (
              <OpportunityCard key={market.id} market={market} type="borrow" index={idx} />
            ))
          ) : (
            <div className="text-sm text-mediumText">No borrow opportunities available</div>
          )}
        </div>
        
        <div>
          <h4 className="text-md font-medium text-blue-500 mb-3">
            <i className="fas fa-shield-alt mr-2"></i>
            Safest Collateral
          </h4>
          {safest_supply_markets.length > 0 ? (
            safest_supply_markets.map((market, idx) => (
              <OpportunityCard key={market.id} market={market} type="safety" index={idx} />
            ))
          ) : (
            <div className="text-sm text-mediumText">No collateral options available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketRecommendations;