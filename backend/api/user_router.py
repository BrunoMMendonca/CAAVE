from fastapi import APIRouter, Depends, HTTPException, Path
from typing import Dict, List, Any
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

from api.models import UserPosition
from cardano.cardano_service import CardanoService

router = APIRouter(prefix="/users", tags=["users"])
logger = logging.getLogger(__name__)

# Dependency to get MongoDB
def get_db():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    return db

# Dependency to get the CardanoService
def get_cardano_service():
    try:
        return CardanoService()
    except Exception as e:
        logger.error(f"Failed to initialize CardanoService: {e}")
        raise HTTPException(status_code=500, detail=f"Cardano service error: {str(e)}")

@router.get("/{address}")
async def get_user_position(
    address: str,
    db = Depends(get_db),
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get a user's position and wallet info"""
    try:
        # Get user position from database
        position = await db.user_positions.find_one({"user_address": address})
        
        # If no position exists, create an empty one
        if not position:
            position = UserPosition(user_address=address).dict()
        
        # Get address info from Cardano blockchain
        try:
            address_info = await cardano_service.get_address_info(address)
        except Exception as e:
            logger.warning(f"Could not get blockchain data for address {address}: {e}")
            address_info = {
                "address": address,
                "balance": {
                    "lovelace": 0,
                    "ada": 0
                },
                "transaction_count": 0,
                "utxo_count": 0,
                "stake_address": None
            }
        
        # Combine data
        return {
            "position": position,
            "address_info": address_info
        }
    except Exception as e:
        logger.error(f"Error getting user position: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting user position: {str(e)}")

@router.post("/simulate-supply")
async def simulate_supply(
    address: str = Path(..., description="User address"),
    asset_id: str = Path(..., description="Asset ID to supply"),
    amount: str = Path(..., description="Amount to supply"),
    db = Depends(get_db)
) -> Dict[str, Any]:
    """Simulate supplying an asset"""
    try:
        # Get market
        market = await db.markets.find_one({"asset_id": asset_id})
        if not market:
            raise HTTPException(status_code=404, detail=f"Market for asset {asset_id} not found")
        
        # Get user position
        position = await db.user_positions.find_one({"user_address": address})
        if not position:
            position = UserPosition(user_address=address).dict()
        
        # Calculate USD value
        amount_float = float(amount)
        amount_usd = amount_float * market["price_usd"]
        
        # Find if user already has a supply position for this asset
        supply_position = None
        for i, supply in enumerate(position["supplies"]):
            if supply["asset_id"] == asset_id:
                supply_position = supply
                supply_index = i
                break
        
        if supply_position:
            # Update existing position
            new_amount = float(supply_position["amount"]) + amount_float
            position["supplies"][supply_index]["amount"] = str(new_amount)
            position["supplies"][supply_index]["amount_usd"] = new_amount * market["price_usd"]
        else:
            # Create new position
            new_supply = {
                "asset_id": asset_id,
                "amount": amount,
                "amount_usd": amount_usd,
                "apy": market["supply_apy"],
                "used_as_collateral": market["can_use_as_collateral"]
            }
            position["supplies"].append(new_supply)
        
        # Update totals
        position["total_supplied_usd"] = sum(supply["amount_usd"] for supply in position["supplies"])
        
        # Calculate new borrow limit
        borrow_limit_usd = 0
        for supply in position["supplies"]:
            if supply["used_as_collateral"]:
                supply_market = await db.markets.find_one({"asset_id": supply["asset_id"]})
                if supply_market:
                    borrow_limit_usd += supply["amount_usd"] * supply_market["collateral_factor"]
        
        position["borrow_limit_usd"] = borrow_limit_usd
        
        # Calculate health factor
        if position["total_borrowed_usd"] > 0:
            position["health_factor"] = borrow_limit_usd / position["total_borrowed_usd"]
        else:
            position["health_factor"] = float('inf')  # No borrows, infinite health
        
        # Save updated position
        position["updated_at"] = datetime.utcnow()
        
        # For simulation, don't actually save to database
        
        return {
            "success": True,
            "simulated_position": position,
            "transaction": {
                "action": "supply",
                "asset_id": asset_id,
                "amount": amount,
                "amount_usd": amount_usd,
                "health_factor_before": position["health_factor"],
                "health_factor_after": position["health_factor"],
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error simulating supply: {e}")
        raise HTTPException(status_code=500, detail=f"Error simulating supply: {str(e)}")

@router.post("/simulate-borrow")
async def simulate_borrow(
    address: str = Path(..., description="User address"),
    asset_id: str = Path(..., description="Asset ID to borrow"),
    amount: str = Path(..., description="Amount to borrow"),
    db = Depends(get_db)
) -> Dict[str, Any]:
    """Simulate borrowing an asset"""
    try:
        # Get market
        market = await db.markets.find_one({"asset_id": asset_id})
        if not market:
            raise HTTPException(status_code=404, detail=f"Market for asset {asset_id} not found")
        
        # Get user position
        position = await db.user_positions.find_one({"user_address": address})
        if not position:
            position = UserPosition(user_address=address).dict()
        
        # Calculate USD value
        amount_float = float(amount)
        amount_usd = amount_float * market["price_usd"]
        
        # Calculate current borrow limit
        borrow_limit_usd = 0
        for supply in position["supplies"]:
            if supply["used_as_collateral"]:
                supply_market = await db.markets.find_one({"asset_id": supply["asset_id"]})
                if supply_market:
                    borrow_limit_usd += supply["amount_usd"] * supply_market["collateral_factor"]
        
        # Calculate new total borrowed
        new_total_borrowed_usd = position["total_borrowed_usd"] + amount_usd
        
        # Check if borrow would exceed limit
        if new_total_borrowed_usd > borrow_limit_usd:
            raise HTTPException(status_code=400, detail="Borrow would exceed borrow limit")
        
        # Find if user already has a borrow position for this asset
        borrow_position = None
        for i, borrow in enumerate(position["borrows"]):
            if borrow["asset_id"] == asset_id:
                borrow_position = borrow
                borrow_index = i
                break
        
        old_health_factor = position["health_factor"]
        
        if borrow_position:
            # Update existing position
            new_amount = float(borrow_position["amount"]) + amount_float
            position["borrows"][borrow_index]["amount"] = str(new_amount)
            position["borrows"][borrow_index]["amount_usd"] = new_amount * market["price_usd"]
        else:
            # Create new position
            new_borrow = {
                "asset_id": asset_id,
                "amount": amount,
                "amount_usd": amount_usd,
                "apy": market["borrow_apy"]
            }
            position["borrows"].append(new_borrow)
        
        # Update totals
        position["total_borrowed_usd"] = sum(borrow["amount_usd"] for borrow in position["borrows"])
        
        # Update borrow limit
        position["borrow_limit_usd"] = borrow_limit_usd
        
        # Calculate new health factor
        if position["total_borrowed_usd"] > 0:
            position["health_factor"] = borrow_limit_usd / position["total_borrowed_usd"]
        else:
            position["health_factor"] = float('inf')  # No borrows, infinite health
        
        # Save updated position
        position["updated_at"] = datetime.utcnow()
        
        # For simulation, don't actually save to database
        
        return {
            "success": True,
            "simulated_position": position,
            "transaction": {
                "action": "borrow",
                "asset_id": asset_id,
                "amount": amount,
                "amount_usd": amount_usd,
                "health_factor_before": old_health_factor,
                "health_factor_after": position["health_factor"],
                "timestamp": datetime.utcnow().isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error simulating borrow: {e}")
        raise HTTPException(status_code=500, detail=f"Error simulating borrow: {str(e)}")
