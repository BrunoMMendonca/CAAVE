from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Union, Any
from datetime import datetime
import uuid

# Base models for Cardano blockchain data
class TokenAmount(BaseModel):
    """Represents a token amount (ADA or native tokens)"""
    unit: str  # "lovelace" for ADA or policy_id+asset_name for native tokens
    quantity: str  # Always a string to handle large numbers

class AssetMetadata(BaseModel):
    """Metadata for a native token/asset"""
    name: Optional[str] = None
    description: Optional[str] = None
    ticker: Optional[str] = None
    url: Optional[str] = None
    logo: Optional[str] = None
    decimals: Optional[int] = None

# Models for AaveADA DeFi protocol
class Market(BaseModel):
    """Represents a lending/borrowing market for an asset"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    asset_id: str  # Policy ID + Asset Name or "lovelace" for ADA
    name: str
    symbol: str
    decimals: int
    logo_url: Optional[str] = None
    
    # Market parameters
    supply_apy: float
    borrow_apy: float
    total_supply: str  # String to handle large numbers
    total_supply_usd: float
    total_borrow: str  # String to handle large numbers
    total_borrow_usd: float
    liquidity: str  # String to handle large numbers
    liquidity_usd: float
    utilization_rate: float  # 0-1 value
    
    # Risk parameters
    collateral_factor: float  # 0-1 value
    liquidation_threshold: float  # 0-1 value
    liquidation_penalty: float  # 0-1 value
    reserve_factor: float  # 0-1 value
    
    # Market state
    is_active: bool = True
    can_supply: bool = True
    can_borrow: bool = True
    can_use_as_collateral: bool = True
    
    # Price data
    price_usd: float
    price_oracle: str  # Description or ID of price oracle source
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserPosition(BaseModel):
    """Represents a user's position in the protocol"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_address: str  # Cardano wallet address
    
    # Totals
    total_supplied_usd: float = 0.0
    total_borrowed_usd: float = 0.0
    borrow_limit_usd: float = 0.0
    health_factor: float = float('inf')  # ∞ if no borrows
    
    # Supply/borrow positions
    supplies: List[Dict[str, Any]] = []  # List of asset supplies
    borrows: List[Dict[str, Any]] = []  # List of asset borrows
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Transaction(BaseModel):
    """Represents a protocol transaction (supply, borrow, repay, withdraw)"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tx_hash: str  # Cardano transaction hash
    user_address: str  # Cardano wallet address
    
    # Transaction details
    action: str  # "supply", "withdraw", "borrow", "repay", "liquidate"
    asset_id: str  # Asset ID being supplied, borrowed, etc.
    amount: str  # String to handle large numbers
    amount_usd: float
    
    # Additional data
    health_factor_before: Optional[float] = None
    health_factor_after: Optional[float] = None
    liquidator: Optional[str] = None  # For liquidations
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Request/response models
class MarketCreate(BaseModel):
    """Model for creating a new market"""
    asset_id: str
    name: str
    symbol: str
    decimals: int
    logo_url: Optional[str] = None
    supply_apy: float
    borrow_apy: float
    total_supply: str
    total_supply_usd: float
    total_borrow: str
    total_borrow_usd: float
    liquidity: str
    liquidity_usd: float
    utilization_rate: float
    collateral_factor: float
    liquidation_threshold: float
    liquidation_penalty: float
    reserve_factor: float
    is_active: bool = True
    can_supply: bool = True
    can_borrow: bool = True
    can_use_as_collateral: bool = True
    price_usd: float
    price_oracle: str

class MarketUpdate(BaseModel):
    """Model for updating a market"""
    supply_apy: Optional[float] = None
    borrow_apy: Optional[float] = None
    total_supply: Optional[str] = None
    total_supply_usd: Optional[float] = None
    total_borrow: Optional[str] = None
    total_borrow_usd: Optional[float] = None
    liquidity: Optional[str] = None
    liquidity_usd: Optional[float] = None
    utilization_rate: Optional[float] = None
    collateral_factor: Optional[float] = None
    liquidation_threshold: Optional[float] = None
    liquidation_penalty: Optional[float] = None
    reserve_factor: Optional[float] = None
    is_active: Optional[bool] = None
    can_supply: Optional[bool] = None
    can_borrow: Optional[bool] = None
    can_use_as_collateral: Optional[bool] = None
    price_usd: Optional[float] = None
    price_oracle: Optional[str] = None
