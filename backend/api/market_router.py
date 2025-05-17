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
