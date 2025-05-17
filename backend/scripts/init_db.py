import asyncio
import os
from pathlib import Path
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv
import sys

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv(Path(__file__).parent.parent / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def init_collections():
    # Create indexes for markets collection
    print("Creating indexes for markets collection...")
    await db.markets.create_index("id", unique=True)
    await db.markets.create_index("asset_id", unique=True)
    
    # Create indexes for user_positions collection
    print("Creating indexes for user_positions collection...")
    await db.user_positions.create_index("user_address", unique=True)
    
    # Create indexes for transactions collection
    print("Creating indexes for transactions collection...")
    await db.transactions.create_index("tx_hash")
    await db.transactions.create_index("user_address")
    
    print("Database initialization complete")

if __name__ == "__main__":
    asyncio.run(init_collections())
