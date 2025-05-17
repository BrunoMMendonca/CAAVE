from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, List, Any
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

from api.models import Market, MarketCreate, MarketUpdate

router = APIRouter(prefix="/markets", tags=["markets"])
logger = logging.getLogger(__name__)

# Dependency to get MongoDB
def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    return db

@router.get("/")
async def get_markets(db = Depends(get_db)) -> List[Market]:
    """Get all markets"""
    try:
        markets = await db.markets.find().to_list(1000)
        return [Market(**market) for market in markets]
    except Exception as e:
        logger.error(f"Error getting markets: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting markets: {str(e)}")

@router.get("/{market_id}")
async def get_market(market_id: str, db = Depends(get_db)) -> Market:
    """Get a specific market by ID"""
    try:
        market = await db.markets.find_one({"id": market_id})
        if not market:
            raise HTTPException(status_code=404, detail=f"Market with ID {market_id} not found")
        return Market(**market)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting market: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting market: {str(e)}")

@router.post("/")
async def create_market(market: MarketCreate, db = Depends(get_db)) -> Market:
    """Create a new market"""
    try:
        # Check if market with this asset_id already exists
        existing = await db.markets.find_one({"asset_id": market.asset_id})
        if existing:
            raise HTTPException(status_code=400, detail=f"Market for asset {market.asset_id} already exists")
        
        # Create new market
        new_market = Market(**market.dict())
        await db.markets.insert_one(new_market.dict())
        return new_market
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating market: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating market: {str(e)}")

@router.put("/{market_id}")
async def update_market(market_id: str, market: MarketUpdate, db = Depends(get_db)) -> Market:
    """Update a market"""
    try:
        # Check if market exists
        existing = await db.markets.find_one({"id": market_id})
        if not existing:
            raise HTTPException(status_code=404, detail=f"Market with ID {market_id} not found")
        
        # Update only provided fields
        update_data = {k: v for k, v in market.dict().items() if v is not None}
        
        # Add updated timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        # Update market
        await db.markets.update_one({"id": market_id}, {"$set": update_data})
        
        # Get updated market
        updated = await db.markets.find_one({"id": market_id})
        return Market(**updated)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating market: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating market: {str(e)}")

@router.delete("/{market_id}")
async def delete_market(market_id: str, db = Depends(get_db)) -> Dict[str, Any]:
    """Delete a market"""
    try:
        # Check if market exists
        existing = await db.markets.find_one({"id": market_id})
        if not existing:
            raise HTTPException(status_code=404, detail=f"Market with ID {market_id} not found")
        
        # Delete market
        await db.markets.delete_one({"id": market_id})
        
        return {"message": f"Market {market_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting market: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting market: {str(e)}")

@router.get("/stats/overview")
async def get_market_stats(db = Depends(get_db)) -> Dict[str, Any]:
    """Get aggregate market statistics"""
    try:
        # Get all markets
        markets = await db.markets.find().to_list(1000)
        
        if not markets:
            return {
                "total_supply": 0,
                "total_borrow": 0,
                "markets_count": 0,
                "avg_supply_rate": 0,
                "avg_borrow_rate": 0,
                "top_markets": []
            }
            
        # Calculate aggregate statistics
        total_supply = sum(float(market["total_supply"]) for market in markets)
        total_borrow = sum(float(market["total_borrow"]) for market in markets)
        
        markets_with_supply = [m for m in markets if float(m["total_supply"]) > 0]
        markets_with_borrow = [m for m in markets if float(m["total_borrow"]) > 0]
        
        avg_supply_rate = sum(m["supply_apy"] for m in markets_with_supply) / len(markets_with_supply) if markets_with_supply else 0
        avg_borrow_rate = sum(m["borrow_apy"] for m in markets_with_borrow) / len(markets_with_borrow) if markets_with_borrow else 0
        
        # Sort markets by total supply for top markets
        sorted_markets = sorted(markets, key=lambda x: x["total_supply"], reverse=True)
        top_markets = [{"id": m["id"], "asset_id": m["asset_id"], "name": m["name"], "total_supply": m["total_supply"]} 
                      for m in sorted_markets[:5]]
        
        return {
            "total_supply": total_supply,
            "total_borrow": total_borrow,
            "markets_count": len(markets),
            "avg_supply_rate": avg_supply_rate,
            "avg_borrow_rate": avg_borrow_rate,
            "top_markets": top_markets
        }
    except Exception as e:
        logger.error(f"Error getting market stats: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting market stats: {str(e)}")
