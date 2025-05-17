from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List, Any
import logging
from cardano.cardano_service import CardanoService

router = APIRouter(prefix="/cardano", tags=["cardano"])
logger = logging.getLogger(__name__)

# Dependency to get the CardanoService
def get_cardano_service():
    try:
        return CardanoService()
    except Exception as e:
        logger.error(f"Failed to initialize CardanoService: {e}")
        raise HTTPException(status_code=500, detail=f"Cardano service error: {str(e)}")

@router.get("/info")
async def get_network_info(
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get general information about the Cardano network"""
    try:
        return await cardano_service.get_network_info()
    except Exception as e:
        logger.error(f"Error getting network info: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting network info: {str(e)}")

@router.get("/address/{address}")
async def get_address_info(
    address: str,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get information about a Cardano address"""
    try:
        return await cardano_service.get_address_info(address)
    except Exception as e:
        logger.error(f"Error getting address info: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting address info: {str(e)}")

@router.get("/transaction/{tx_hash}")
async def get_transaction_info(
    tx_hash: str,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get information about a transaction"""
    try:
        return await cardano_service.get_transaction_info(tx_hash)
    except Exception as e:
        logger.error(f"Error getting transaction info: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting transaction info: {str(e)}")

@router.get("/asset/{asset}")
async def get_asset_info(
    asset: str,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get information about a native token/asset"""
    try:
        return await cardano_service.get_asset_info(asset)
    except Exception as e:
        logger.error(f"Error getting asset info: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting asset info: {str(e)}")

@router.get("/parameters")
async def get_protocol_parameters(
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get the latest protocol parameters"""
    try:
        return await cardano_service.get_latest_protocol_parameters()
    except Exception as e:
        logger.error(f"Error getting protocol parameters: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting protocol parameters: {str(e)}")

@router.get("/pools")
async def get_pools(
    limit: int = 10,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> List[Dict[str, Any]]:
    """Get a list of stake pools"""
    try:
        return await cardano_service.get_pool_list(limit=limit)
    except Exception as e:
        logger.error(f"Error getting pools: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting pools: {str(e)}")

@router.get("/tokens")
async def get_tokens(
    limit: int = 10,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> List[Dict[str, Any]]:
    """Get a list of registered tokens"""
    try:
        return await cardano_service.get_token_registry(limit=limit)
    except Exception as e:
        logger.error(f"Error getting tokens: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting tokens: {str(e)}")

@router.get("/address/{address}")
async def get_address_info(
    address: str,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> Dict[str, Any]:
    """Get information about a wallet address including balance"""
    try:
        return await cardano_service.get_wallet_balance(address)
    except Exception as e:
        logger.error(f"Error getting address info: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting address info: {str(e)}")

@router.get("/latest-blocks")
async def get_latest_blocks(
    limit: int = 10,
    cardano_service: CardanoService = Depends(get_cardano_service)
) -> List[Dict[str, Any]]:
    """Get the latest blocks from the Cardano blockchain"""
    try:
        return await cardano_service.get_latest_blocks(limit=limit)
    except Exception as e:
        logger.error(f"Error getting latest blocks: {e}")
        raise HTTPException(status_code=500, detail=f"Error getting latest blocks: {str(e)}")
