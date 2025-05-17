from blockfrost import BlockFrostApi, ApiError
import os
from typing import Dict, List, Any, Optional
import logging

from settings import BLOCKFROST_API_KEY, BLOCKFROST_NETWORK

logger = logging.getLogger(__name__)

class CardanoService:
    def __init__(self):
        # Get API key and network from environment variables
        api_key = BLOCKFROST_API_KEY
        network = BLOCKFROST_NETWORK
        
        if not api_key:
            raise ValueError("BLOCKFROST_API_KEY environment variable is not set")
        
        # Initialize BlockFrost API
        if network == "mainnet":
            self.api = BlockFrostApi(project_id=api_key)
        elif network == "preprod":
            self.api = BlockFrostApi(project_id=api_key, base_url="https://cardano-preprod.blockfrost.io/api/v0")
        elif network == "preview":
            self.api = BlockFrostApi(project_id=api_key, base_url="https://cardano-preview.blockfrost.io/api/v0")
        else:
            raise ValueError(f"Unsupported network: {network}")
        
        self.network = network
        logger.info(f"CardanoService initialized with network: {network}")

    async def get_network_info(self) -> Dict[str, Any]:
        """Get general information about the Cardano network"""
        try:
            # Get the latest epoch
            latest_epoch = self.api.epoch_latest()
            
            # Get network parameters
            parameters = self.api.epoch_parameters(latest_epoch.epoch)
            
            # Get latest block
            latest_block = self.api.block_latest()
            
            # Return network info
            return {
                "network": self.network,
                "epoch": latest_epoch.epoch,
                "slot": latest_block.slot,
                "block_height": latest_block.height,
                "parameters": {
                    "min_fee_a": parameters.min_fee_a,
                    "min_fee_b": parameters.min_fee_b,
                    "max_block_size": parameters.max_block_size,
                    "max_tx_size": parameters.max_tx_size,
                    "protocol_major_ver": parameters.protocol_major_ver,
                    "protocol_minor_ver": parameters.protocol_minor_ver,
                }
            }
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise

    async def get_address_info(self, address: str) -> Dict[str, Any]:
        """Get information about a Cardano address"""
        try:
            # Get address info
            address_info = self.api.address(address)
            
            # Get address transactions
            address_txs = self.api.address_transactions(address)
            
            # Get address UTXOs
            address_utxos = self.api.address_utxos(address)
            
            # Calculate total lovelace
            total_lovelace = 0
            for utxo in address_utxos:
                for amount in utxo.amount:
                    if amount.unit == "lovelace":
                        total_lovelace += int(amount.quantity)
            
            # Convert to ADA
            total_ada = total_lovelace / 1_000_000
            
            # Return address info
            return {
                "address": address,
                "balance": {
                    "lovelace": total_lovelace,
                    "ada": total_ada
                },
                "transaction_count": len(address_txs),
                "utxo_count": len(address_utxos),
                "stake_address": address_info.stake_address
            }
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise

    async def get_transaction_info(self, tx_hash: str) -> Dict[str, Any]:
        """Get information about a transaction"""
        try:
            # Get transaction info
            tx = self.api.transaction(tx_hash)
            
            # Get transaction UTXOs
            tx_utxos = self.api.transaction_utxos(tx_hash)
            
            # Return transaction info
            return {
                "hash": tx.hash,
                "block": tx.block,
                "block_height": tx.block_height,
                "slot": tx.slot,
                "index": tx.index,
                "output_amount": tx_utxos.outputs,
                "fees": tx.fees,
                "deposit": tx.deposit,
                "size": tx.size,
                "invalid_before": tx.invalid_before,
                "invalid_hereafter": tx.invalid_hereafter,
                "utxo_count": len(tx_utxos.outputs) + len(tx_utxos.inputs),
                "withdrawal_count": tx.withdrawal_count,
                "delegation_count": tx.delegation_count,
                "stake_cert_count": tx.stake_cert_count,
                "asset_mint_or_burn_count": tx.asset_mint_or_burn_count,
            }
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise

    async def get_asset_info(self, asset: str) -> Dict[str, Any]:
        """Get information about a native token/asset"""
        try:
            # Get asset info
            asset_info = self.api.asset(asset)
            
            # Get asset history
            asset_history = self.api.asset_history(asset)
            
            # Get asset transactions
            asset_txs = self.api.asset_transactions(asset)
            
            # Get asset addresses
            asset_addresses = self.api.asset_addresses(asset)
            
            # Return asset info
            return {
                "asset": asset,
                "policy_id": asset_info.policy_id,
                "asset_name": asset_info.asset_name,
                "fingerprint": asset_info.fingerprint,
                "quantity": asset_info.quantity,
                "initial_mint_tx_hash": asset_info.initial_mint_tx_hash,
                "mint_or_burn_count": len(asset_history),
                "transaction_count": len(asset_txs),
                "address_count": len(asset_addresses),
                "metadata": asset_info.metadata
            }
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise

    async def get_latest_protocol_parameters(self) -> Dict[str, Any]:
        """Get the latest protocol parameters"""
        try:
            # Get the latest epoch
            latest_epoch = self.api.epoch_latest()
            
            # Get protocol parameters
            params = self.api.epoch_parameters(latest_epoch.epoch)
            
            return {
                "epoch": latest_epoch.epoch,
                "min_fee_a": params.min_fee_a,
                "min_fee_b": params.min_fee_b,
                "max_block_size": params.max_block_size,
                "max_tx_size": params.max_tx_size,
                "max_tx_ex_steps": params.max_tx_ex_steps,
                "max_tx_ex_mem": params.max_tx_ex_mem,
                "key_deposit": params.key_deposit,
                "pool_deposit": params.pool_deposit,
                "min_pool_cost": params.min_pool_cost,
                "price_mem": params.price_mem,
                "price_step": params.price_step,
                "max_val_size": params.max_val_size,
                "collateral_percent": params.collateral_percent,
                "max_collateral_inputs": params.max_collateral_inputs,
                "coins_per_utxo_word": params.coins_per_utxo_word,
                "protocol_major_ver": params.protocol_major_ver,
                "protocol_minor_ver": params.protocol_minor_ver,
            }
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise

    async def get_pool_list(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get a list of stake pools"""
        try:
            # Get all pools
            pools = self.api.pools(count=limit, order="desc")
            
            result = []
            for pool_id in pools:
                # Get pool details
                pool = self.api.pool(pool_id)
                
                # Get pool metadata
                try:
                    metadata = self.api.pool_metadata(pool_id)
                    meta = {
                        "name": metadata.name,
                        "description": metadata.description,
                        "ticker": metadata.ticker,
                        "homepage": metadata.homepage,
                    }
                except ApiError:
                    meta = None
                
                result.append({
                    "pool_id": pool_id,
                    "active_stake": pool.active_stake,
                    "live_stake": pool.live_stake,
                    "blocks_minted": pool.blocks_minted,
                    "live_delegators": pool.live_delegators,
                    "fixed_cost": pool.fixed_cost,
                    "margin_cost": pool.margin_cost,
                    "pledge": pool.pledge,
                    "reward_account": pool.reward_account,
                    "metadata": meta
                })
            
            return result
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise

    async def get_token_registry(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get a list of registered tokens"""
        try:
            # Get all assets
            assets = self.api.assets(count=limit, order="desc")
            
            result = []
            for asset in assets:
                # Get asset details
                asset_info = self.api.asset(asset)
                
                result.append({
                    "asset": asset,
                    "policy_id": asset_info.policy_id,
                    "asset_name": asset_info.asset_name,
                    "fingerprint": asset_info.fingerprint,
                    "quantity": asset_info.quantity,
                    "initial_mint_tx_hash": asset_info.initial_mint_tx_hash,
                    "metadata": asset_info.metadata
                })
            
            return result
        except ApiError as e:
            logger.error(f"BlockFrost API error: {e}")
            raise
