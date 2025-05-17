
import requests
import sys
import json
import os
from datetime import datetime

class AaveADABackendTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.text}")
                except:
                    pass
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api",
            200
        )

    def test_status_check(self):
        """Test the status check endpoint"""
        client_name = f"test_client_{datetime.now().strftime('%H%M%S')}"
        return self.run_test(
            "Status Check",
            "POST",
            "api/status",
            200,
            data={"client_name": client_name}
        )

    def test_get_status_checks(self):
        """Test getting all status checks"""
        return self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        
    def test_market_stats_overview(self):
        """Test the market stats overview endpoint"""
        return self.run_test(
            "Market Stats Overview",
            "GET",
            "api/markets/stats/overview",
            200
        )
        
    def test_get_markets(self):
        """Test getting all markets"""
        return self.run_test(
            "Get All Markets",
            "GET",
            "api/markets",
            200
        )
        
    def test_cardano_latest_blocks(self):
        """Test getting latest Cardano blocks"""
        return self.run_test(
            "Cardano Latest Blocks",
            "GET",
            "api/cardano/latest-blocks",
            200
        )
        
    def test_cardano_address_info(self):
        """Test getting Cardano address info"""
        # Using a random test address
        test_address = "addr1qxck6uqvj0k6wgyrwmvp9um7ucvd5g4csnu3dmxh4ype95lh8nyj9q0kvddwzrwp6t3w9vw7m3rpcf9qcgwf6qsj2pnqnhpj2t"
        return self.run_test(
            "Cardano Address Info",
            "GET",
            f"api/cardano/address/{test_address}",
            200
        )

def main():
    # Get backend URL from environment variable or use default
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://32a35358-7af5-418d-b2ae-15f2febbab87.preview.emergentagent.com')
    
    print(f"Testing backend API at: {backend_url}")
    
    # Setup tester
    tester = AaveADABackendTester(backend_url)
    
    # Run tests
    root_success, _ = tester.test_root_endpoint()
    if not root_success:
        print("❌ Root API endpoint test failed, stopping tests")
        return 1
    
    status_success, status_response = tester.test_status_check()
    if not status_success:
        print("❌ Status check test failed")
    else:
        print(f"✅ Created status check with ID: {status_response.get('id', 'unknown')}")
    
    get_status_success, status_checks = tester.test_get_status_checks()
    if not get_status_success:
        print("❌ Get status checks test failed")
    else:
        print(f"✅ Retrieved {len(status_checks)} status checks")
    
    # Test new market stats endpoint
    market_stats_success, market_stats = tester.test_market_stats_overview()
    if not market_stats_success:
        print("❌ Market stats overview test failed")
    else:
        print(f"✅ Retrieved market stats: {json.dumps(market_stats, indent=2)}")
    
    # Test markets endpoint
    markets_success, markets = tester.test_get_markets()
    if not markets_success:
        print("❌ Get markets test failed")
    else:
        print(f"✅ Retrieved {len(markets)} markets")
    
    # Test Cardano latest blocks endpoint
    # Note: This might fail with 403 due to invalid API key as mentioned in the request
    cardano_blocks_success, cardano_blocks = tester.test_cardano_latest_blocks()
    if not cardano_blocks_success:
        print("❌ Cardano latest blocks test failed (This might be expected due to invalid API key)")
    else:
        print(f"✅ Retrieved {len(cardano_blocks)} Cardano blocks")
    
    # Test Cardano address info endpoint
    # Note: This might fail with 403 due to invalid API key as mentioned in the request
    cardano_address_success, cardano_address = tester.test_cardano_address_info()
    if not cardano_address_success:
        print("❌ Cardano address info test failed (This might be expected due to invalid API key)")
    else:
        print(f"✅ Retrieved Cardano address info")
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
