
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

def main():
    # Get backend URL from environment variable or use default
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://0236c0e3-2b50-4c09-9f2d-8b7c74f066a1.preview.emergentagent.com')
    
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
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
