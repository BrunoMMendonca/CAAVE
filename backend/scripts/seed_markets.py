import asyncio
import sys
import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Market seed data
markets = [
    {
        "id": "ada",
        "asset_id": "lovelace",
        "name": "Cardano",
        "symbol": "ADA",
        "decimals": 6,
        "logo_url": "https://images.unsplash.com/photo-1639768939489-025b90ba9f23",
        "supply_apy": 3.25,
        "borrow_apy": 5.45,
        "total_supply": "25000000000000",
        "total_supply_usd": 12000000,
        "total_borrow": "15000000000000",
        "total_borrow_usd": 7200000,
        "liquidity": "10000000000000",
        "liquidity_usd": 4800000,
        "utilization_rate": 0.6,
        "collateral_factor": 0.75,
        "liquidation_threshold": 0.8,
        "liquidation_penalty": 0.05,
        "reserve_factor": 0.1,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 0.48,
        "price_oracle": "chainlink"
    },
    {
        "id": "djed",
        "asset_id": "d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a0.tokenname",
        "name": "DJED Stablecoin",
        "symbol": "DJED",
        "decimals": 6,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 2.85,
        "borrow_apy": 4.75,
        "total_supply": "10000000000000",
        "total_supply_usd": 10000000,
        "total_borrow": "6000000000000",
        "total_borrow_usd": 6000000,
        "liquidity": "4000000000000",
        "liquidity_usd": 4000000,
        "utilization_rate": 0.6,
        "collateral_factor": 0.9,
        "liquidation_threshold": 0.95,
        "liquidation_penalty": 0.03,
        "reserve_factor": 0.05,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 1.00,
        "price_oracle": "chainlink"
    },
    {
        "id": "shen",
        "asset_id": "d894897411707efa755a76deb66d26dfd50593f2e70863e1661e98a0.shen",
        "name": "SHEN",
        "symbol": "SHEN",
        "decimals": 6,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 4.15,
        "borrow_apy": 6.25,
        "total_supply": "8000000000000",
        "total_supply_usd": 7600000,
        "total_borrow": "3500000000000",
        "total_borrow_usd": 3325000,
        "liquidity": "4500000000000",
        "liquidity_usd": 4275000,
        "utilization_rate": 0.4375,
        "collateral_factor": 0.6,
        "liquidation_threshold": 0.65,
        "liquidation_penalty": 0.08,
        "reserve_factor": 0.15,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 0.95,
        "price_oracle": "chainlink"
    },
    {
        "id": "iusd",
        "asset_id": "f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880.iUSD",
        "name": "Indigo USD",
        "symbol": "iUSD",
        "decimals": 6,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 3.00,
        "borrow_apy": 4.80,
        "total_supply": "5000000000000",
        "total_supply_usd": 5000000,
        "total_borrow": "2500000000000",
        "total_borrow_usd": 2500000,
        "liquidity": "2500000000000",
        "liquidity_usd": 2500000,
        "utilization_rate": 0.5,
        "collateral_factor": 0.85,
        "liquidation_threshold": 0.9,
        "liquidation_penalty": 0.04,
        "reserve_factor": 0.08,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 1.00,
        "price_oracle": "chainlink"
    },
    {
        "id": "hosky",
        "asset_id": "a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235.HOSKY",
        "name": "Hosky Token",
        "symbol": "HOSKY",
        "decimals": 6,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 7.50,
        "borrow_apy": 9.25,
        "total_supply": "1000000000000000",
        "total_supply_usd": 100000,
        "total_borrow": "300000000000000",
        "total_borrow_usd": 30000,
        "liquidity": "700000000000000",
        "liquidity_usd": 70000,
        "utilization_rate": 0.3,
        "collateral_factor": 0.3,
        "liquidation_threshold": 0.35,
        "liquidation_penalty": 0.15,
        "reserve_factor": 0.2,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 0.0001,
        "price_oracle": "dex"
    },
    {
        "id": "milk",
        "asset_id": "8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa.MILK",
        "name": "Milk Coin",
        "symbol": "MILK",
        "decimals": 6,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 5.85,
        "borrow_apy": 7.95,
        "total_supply": "15000000000000",
        "total_supply_usd": 1800000,
        "total_borrow": "7500000000000",
        "total_borrow_usd": 900000,
        "liquidity": "7500000000000",
        "liquidity_usd": 900000,
        "utilization_rate": 0.5,
        "collateral_factor": 0.5,
        "liquidation_threshold": 0.55,
        "liquidation_penalty": 0.1,
        "reserve_factor": 0.15,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 0.12,
        "price_oracle": "dex"
    },
    {
        "id": "wbtc",
        "asset_id": "57fca08abbaddee36da742a839f7d83a7e1d2419f1507fcbf39165724c53454c.WBTC",
        "name": "Wrapped Bitcoin",
        "symbol": "WBTC",
        "decimals": 8,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 1.85,
        "borrow_apy": 3.95,
        "total_supply": "50000000000",
        "total_supply_usd": 26000000,
        "total_borrow": "20000000000",
        "total_borrow_usd": 10400000,
        "liquidity": "30000000000",
        "liquidity_usd": 15600000,
        "utilization_rate": 0.4,
        "collateral_factor": 0.8,
        "liquidation_threshold": 0.85,
        "liquidation_penalty": 0.05,
        "reserve_factor": 0.1,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 52000,
        "price_oracle": "chainlink"
    },
    {
        "id": "weth",
        "asset_id": "57fca08abbaddee36da742a839f7d83a7e1d2419f1507fcbf39165724c53454c.WETH",
        "name": "Wrapped Ethereum",
        "symbol": "WETH",
        "decimals": 18,
        "logo_url": "https://images.unsplash.com/photo-1639916909400-40d53a2edd72",
        "supply_apy": 2.25,
        "borrow_apy": 4.25,
        "total_supply": "2500000000000000000000",
        "total_supply_usd": 7500000,
        "total_borrow": "1000000000000000000000",
        "total_borrow_usd": 3000000,
        "liquidity": "1500000000000000000000",
        "liquidity_usd": 4500000,
        "utilization_rate": 0.4,
        "collateral_factor": 0.75,
        "liquidation_threshold": 0.8,
        "liquidation_penalty": 0.05,
        "reserve_factor": 0.1,
        "is_active": True,
        "can_supply": True,
        "can_borrow": True,
        "can_use_as_collateral": True,
        "price_usd": 3000,
        "price_oracle": "chainlink"
    }
]

async def seed_markets():
    # First, clear existing markets
    await db.markets.delete_many({})
    
    # Insert markets
    for market in markets:
        market["created_at"] = datetime.utcnow()
        market["updated_at"] = datetime.utcnow()
        await db.markets.insert_one(market)
    
    # Verify
    count = await db.markets.count_documents({})
    print(f"Successfully seeded {count} markets into the database")

if __name__ == "__main__":
    asyncio.run(seed_markets())
