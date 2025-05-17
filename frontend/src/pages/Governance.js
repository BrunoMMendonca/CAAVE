import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Governance = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteType, setVoteType] = useState('for'); // 'for', 'against', 'abstain'
  
  // Mock data for governance proposals
  const proposals = [
    {
      id: 'AAVEADA-1',
      title: 'Add DJED stablecoin as a collateral asset',
      description: 'Proposal to add DJED stablecoin as a collateral asset with a 75% loan-to-value ratio and 80% liquidation threshold.',
      status: 'active',
      votes: {
        for: 1250000,
        against: 350000,
        abstain: 125000,
      },
      totalVotes: 1725000,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      creator: '0xf39F...3a4B',
      created: '2024-02-15',
    },
    {
      id: 'AAVEADA-2',
      title: 'Adjust interest rate model for ADA',
      description: 'Proposal to adjust the interest rate model for ADA to optimize utilization and borrowing rates.',
      status: 'active',
      votes: {
        for: 980000,
        against: 620000,
        abstain: 80000,
      },
      totalVotes: 1680000,
      endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      creator: '0x2a1B...9c7D',
      created: '2024-02-12',
    },
    {
      id: 'AAVEADA-3',
      title: 'Integrate with Milkomeda sidechain',
      description: 'Proposal to integrate AaveADA with Milkomeda sidechain to expand protocol reach and capabilities.',
      status: 'closed',
      votes: {
        for: 2100000,
        against: 450000,
        abstain: 200000,
      },
      totalVotes: 2750000,
      endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      creator: '0x8c3F...2e5A',
      created: '2024-01-20',
      result: 'passed',
    },
    {
      id: 'AAVEADA-4',
      title: 'Increase reserve factor for HOSKY token',
      description: 'Proposal to increase the reserve factor for HOSKY token from 10% to 20% to improve protocol safety.',
      status: 'closed',
      votes: {
        for: 850000,
        against: 1500000,
        abstain: 125000,
      },
      totalVotes: 2475000,
      endTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      creator: '0x4d2E...6f1B',
      created: '2024-01-10',
      result: 'rejected',
    },
  ];
  
  const filteredProposals = proposals.filter(
    proposal => activeTab === 'all' || proposal.status === activeTab
  );
  
  const handleVoteClick = (proposal) => {
    setSelectedProposal(proposal);
    setShowVoteModal(true);
  };
  
  const handleVote = () => {
    console.log(`Voted ${voteType} on proposal ${selectedProposal.id}`);
    setShowVoteModal(false);
  };
  
  // Helper function to format remaining time
  const formatTimeRemaining = (endTime) => {
    const now = new Date();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h remaining`;
  };
  
  // Calculate percentage of votes
  const calculatePercentage = (votes, total) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-lightText">Governance</h1>
        
        <div className="flex space-x-4">
          <button 
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'active' 
                ? 'gradient-button text-white' 
                : 'bg-darkBlue text-mediumText border border-gray-700 hover:text-lightText'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'closed' 
                ? 'gradient-button text-white' 
                : 'bg-darkBlue text-mediumText border border-gray-700 hover:text-lightText'
            }`}
            onClick={() => setActiveTab('closed')}
          >
            Closed
          </button>
          <button 
            className={`px-6 py-2 rounded-lg font-medium ${
              activeTab === 'all' 
                ? 'gradient-button text-white' 
                : 'bg-darkBlue text-mediumText border border-gray-700 hover:text-lightText'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
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
            <h2 className="text-2xl font-bold mb-6 text-lightText">AaveADA Governance</h2>
            <p className="text-mediumText mb-6">
              AaveADA governance allows token holders to vote on protocol changes and improvements.
              By staking ADA, you can participate in the governance process and shape the future of the protocol.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-darkBlue border border-primary text-primary hover:bg-primary hover:bg-opacity-10 px-6 py-3 rounded-lg font-medium"
              id="create-proposal-button"
            >
              Create Proposal
            </motion.button>
          </div>
          
          <div className="mt-6 md:mt-0">
            <div className="bg-darkBlue p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Your Voting Power</span>
                <span className="text-primary text-2xl font-bold">2,500 ADA</span>
              </div>
            </div>
            
            <div className="bg-darkBlue p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Active Proposals</span>
                <span className="text-lightText text-2xl font-bold">2</span>
              </div>
            </div>
            
            <div className="bg-darkBlue p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Proposals You've Voted On</span>
                <span className="text-lightText text-2xl font-bold">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 mb-10">
        {filteredProposals.map(proposal => (
          <div key={proposal.id} className="card overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-lightText">{proposal.title}</h3>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  proposal.status === 'active' 
                    ? 'bg-green-500 bg-opacity-20 text-green-500' 
                    : proposal.result === 'passed'
                      ? 'bg-primary bg-opacity-20 text-primary'
                      : 'bg-red-500 bg-opacity-20 text-red-500'
                }`}>
                  {proposal.status === 'active' 
                    ? 'Active' 
                    : proposal.result === 'passed' 
                      ? 'Passed' 
                      : 'Rejected'}
                </div>
              </div>
              <div className="flex items-center text-mediumText text-sm mb-4">
                <span>ID: {proposal.id}</span>
                <span className="mx-3">•</span>
                <span>Created by: {proposal.creator}</span>
                <span className="mx-3">•</span>
                <span>Created: {proposal.created}</span>
              </div>
              <p className="text-mediumText mb-6">{proposal.description}</p>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mediumText text-sm">For: {(proposal.votes.for).toLocaleString()} ADA ({calculatePercentage(proposal.votes.for, proposal.totalVotes)}%)</span>
                  <span className="text-green-500 text-sm">{calculatePercentage(proposal.votes.for, proposal.totalVotes)}%</span>
                </div>
                <div className="w-full bg-darkerBlue rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${calculatePercentage(proposal.votes.for, proposal.totalVotes)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mediumText text-sm">Against: {(proposal.votes.against).toLocaleString()} ADA ({calculatePercentage(proposal.votes.against, proposal.totalVotes)}%)</span>
                  <span className="text-red-500 text-sm">{calculatePercentage(proposal.votes.against, proposal.totalVotes)}%</span>
                </div>
                <div className="w-full bg-darkerBlue rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${calculatePercentage(proposal.votes.against, proposal.totalVotes)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-mediumText text-sm">Abstain: {(proposal.votes.abstain).toLocaleString()} ADA ({calculatePercentage(proposal.votes.abstain, proposal.totalVotes)}%)</span>
                  <span className="text-yellow-500 text-sm">{calculatePercentage(proposal.votes.abstain, proposal.totalVotes)}%</span>
                </div>
                <div className="w-full bg-darkerBlue rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${calculatePercentage(proposal.votes.abstain, proposal.totalVotes)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-mediumText">
                  {proposal.status === 'active' 
                    ? formatTimeRemaining(proposal.endTime) 
                    : `Ended ${new Date(proposal.endTime).toLocaleDateString()}`}
                </div>
                
                {proposal.status === 'active' && (
                  <button 
                    className="gradient-button px-6 py-2 rounded-lg text-white font-medium"
                    onClick={() => handleVoteClick(proposal)}
                    id={`vote-button-${proposal.id}`}
                  >
                    Vote
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-lightText mb-4">How Governance Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white mr-3">1</div>
              <h4 className="text-lightText font-medium">Proposals</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Proposals can be created by anyone with sufficient voting power.
              Each proposal has a detailed description and specific changes to be implemented.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white mr-3">2</div>
              <h4 className="text-lightText font-medium">Voting</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              Stake holders can vote on proposals with their staked ADA.
              Voting power is proportional to the amount of ADA staked.
            </p>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-accentTeal flex items-center justify-center text-white mr-3">3</div>
              <h4 className="text-lightText font-medium">Execution</h4>
            </div>
            <p className="text-mediumText text-sm pl-11">
              If a proposal passes (more than 50% of votes in favor),
              it is queued for execution and implemented by the protocol.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-lightText mb-4">Governance FAQs</h3>
        <div className="space-y-4">
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">How is voting power calculated?</h4>
            <p className="text-mediumText text-sm">
              Your voting power is equal to the amount of ADA you have staked in the protocol.
              The more ADA you stake, the more influence you have in the governance process.
            </p>
          </div>
          
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">What types of proposals can be created?</h4>
            <p className="text-mediumText text-sm">
              Proposals can cover various aspects of the protocol, including adding new assets,
              adjusting interest rate models, modifying risk parameters, and upgrading protocol features.
            </p>
          </div>
          
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">What is the voting period?</h4>
            <p className="text-mediumText text-sm">
              Voting periods typically last for 7 days to allow sufficient time for all stake holders to participate.
              After the voting period ends, proposals with majority support are implemented.
            </p>
          </div>
          
          <div className="p-4 bg-darkBlue rounded-lg">
            <h4 className="text-lightText font-medium mb-2">Can I change my vote?</h4>
            <p className="text-mediumText text-sm">
              Yes, you can change your vote any time during the voting period.
              Your final vote at the end of the voting period is what counts.
            </p>
          </div>
        </div>
      </div>
      
      {/* Vote Modal */}
      {showVoteModal && selectedProposal && (
        <div className="modal-overlay" id="vote-modal">
          <div className="modal-content">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-lightText">Vote on Proposal</h3>
              <button 
                className="text-mediumText hover:text-lightText"
                onClick={() => setShowVoteModal(false)}
                id="close-vote-modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lightText font-medium mb-2">{selectedProposal.title}</h4>
              <p className="text-mediumText text-sm mb-2">{selectedProposal.description}</p>
              <div className="text-sm text-mediumText">
                ID: {selectedProposal.id} • {formatTimeRemaining(selectedProposal.endTime)}
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lightText font-medium mb-4">Your Vote</h4>
              <div className="space-y-3">
                <label className="flex items-center p-3 bg-darkerBlue rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="vote" 
                    className="mr-3" 
                    checked={voteType === 'for'}
                    onChange={() => setVoteType('for')}
                    id="vote-for"
                  />
                  <div>
                    <div className="text-lightText font-medium">For</div>
                    <div className="text-mediumText text-sm">Support this proposal</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 bg-darkerBlue rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="vote" 
                    className="mr-3" 
                    checked={voteType === 'against'}
                    onChange={() => setVoteType('against')}
                    id="vote-against"
                  />
                  <div>
                    <div className="text-lightText font-medium">Against</div>
                    <div className="text-mediumText text-sm">Oppose this proposal</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 bg-darkerBlue rounded-lg cursor-pointer">
                  <input 
                    type="radio" 
                    name="vote" 
                    className="mr-3" 
                    checked={voteType === 'abstain'}
                    onChange={() => setVoteType('abstain')}
                    id="vote-abstain"
                  />
                  <div>
                    <div className="text-lightText font-medium">Abstain</div>
                    <div className="text-mediumText text-sm">Neutral stance</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-darkerBlue rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-mediumText">Your Voting Power</span>
                <span className="text-primary font-medium">2,500 ADA</span>
              </div>
            </div>
            
            <button 
              className="w-full gradient-button py-3 rounded-lg text-white font-medium"
              onClick={handleVote}
              id="submit-vote-button"
            >
              Submit Vote
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance;
