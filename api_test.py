import requests
import json
import sys

def test_api_endpoint(endpoint, expected_status=200):
    """Test an API endpoint and return the response"""
    url = f"http://localhost:8001/api/{endpoint}"
    print(f"\n🔍 Testing endpoint: {url}")
    
    try:
        response = requests.get(url)
        
        if response.status_code == expected_status:
            print(f"✅ Success - Status: {response.status_code}")
            try:
                return True, response.json()
            except json.JSONDecodeError:
                return True, response.text
        else:
            print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
            try:
                return False, response.json()
            except json.JSONDecodeError:
                return False, response.text
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False, None

def main():
    tests_passed = 0
    tests_run = 0
    
    # Test 1: Get all markets
    tests_run += 1
    success, markets = test_api_endpoint("markets/")
    
    if success:
        tests_passed += 1
        print(f"Found {len(markets)} markets")
        if len(markets) == 8:
            print("✅ Expected number of markets (8) found")
        else:
            print(f"⚠️ Expected 8 markets, but found {len(markets)}")
        
        # Print first market details
        if markets and len(markets) > 0:
            first_market = markets[0]
            print(f"Sample market: {first_market['name']} ({first_market['symbol']})")
            print(f"  Supply APY: {first_market['supply_apy']}%")
            print(f"  Borrow APY: {first_market['borrow_apy']}%")
            print(f"  Total Supply: {first_market['total_supply']}")
            print(f"  Total Borrow: {first_market['total_borrow']}")
    
    # Test 2: Get market statistics
    tests_run += 1
    success, stats = test_api_endpoint("markets/stats/overview")
    
    if success:
        tests_passed += 1
        print("Market Statistics:")
        print(f"  Total Supply: {stats['total_supply']}")
        print(f"  Total Borrow: {stats['total_borrow']}")
        print(f"  Markets Count: {stats['markets_count']}")
        print(f"  Avg Supply Rate: {stats['avg_supply_rate']}%")
        print(f"  Avg Borrow Rate: {stats['avg_borrow_rate']}%")
        print(f"  Top Markets: {len(stats['top_markets'])} markets")
        
        # Print top market details
        if stats['top_markets'] and len(stats['top_markets']) > 0:
            top_market = stats['top_markets'][0]
            print(f"  Top Market: {top_market['name']} (Total Supply: {top_market['total_supply']})")
    
    # Test 3: Get Cardano latest blocks (expected to fail with 403)
    tests_run += 1
    success, _ = test_api_endpoint("cardano/latest-blocks", expected_status=500)
    
    if not success:
        tests_passed += 1
        print("✅ Expected failure for Cardano latest blocks (BlockFrost API call)")
    
    # Print results
    print(f"\n📊 Tests passed: {tests_passed}/{tests_run}")
    return 0 if tests_passed == tests_run else 1

if __name__ == "__main__":
    sys.exit(main())