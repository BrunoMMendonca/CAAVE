import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).parent.resolve()

# Load environment variables
load_dotenv(BASE_DIR / '.env')

# MongoDB settings
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'test_database')

# Cardano settings
BLOCKFROST_API_KEY = os.environ.get('BLOCKFROST_API_KEY', '')
BLOCKFROST_NETWORK = os.environ.get('BLOCKFROST_NETWORK', 'preprod')

# API settings
API_PREFIX = '/api'

# CORS settings
CORS_ORIGINS = ['*']
CORS_METHODS = ['*']
CORS_HEADERS = ['*']
