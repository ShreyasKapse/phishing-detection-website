import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("TEST 1: Health Check")
    print("="*60)
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {json.dumps(resp.json(), indent=2)}")
        return resp.status_code == 200
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_url_analysis():
    """Test URL analysis endpoint"""
    print("\n" + "="*60)
    print("TEST 2: URL Analysis")
    print("="*60)
    try:
        headers = {"Authorization": "Bearer mock_token"}
        data = {"url": "http://suspicious-phishing-site.com"}
        
        print(f"Request: POST {BASE_URL}/api/analyze/url")
        print(f"Headers: {headers}")
        print(f"Payload: {json.dumps(data, indent=2)}")
        
        resp = requests.post(f"{BASE_URL}/api/analyze/url", json=data, headers=headers)
        print(f"\nStatus Code: {resp.status_code}")
        
        if resp.status_code == 200:
            result = resp.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            
            # Verify response format
            required_fields = ['verdict', 'score', 'signals', 'warnings']
            missing = [f for f in required_fields if f not in result]
            
            if missing:
                print(f"Missing required fields: {missing}")
                return False
            
            print(f"\nResponse Format Valid")
            print(f"   Verdict: {result['verdict']}")
            print(f"   Score: {result['score']}")
            print(f"   Risk Level: {result.get('risk_level', 'N/A')}")
            print(f"   Signals Count: {len(result['signals'])}")
            return True
        else:
            print(f"Response: {resp.text}")
            return False
            
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def test_email_analysis():
    """Test email analysis endpoint"""
    print("\n" + "="*60)
    print("TEST 3: Email Analysis")
    print("="*60)
    try:
        headers = {"Authorization": "Bearer mock_token"}
        data = {
            "subject": "URGENT: Verify your account now!",
            "body": "Click here to verify: http://fake-bank-site.com/verify",
            "from": "noreply@suspicious-domain.com",
            "reply_to": ""
        }
        
        print(f"Request: POST {BASE_URL}/api/analyze/email")
        print(f"Payload: {json.dumps(data, indent=2)}")
        
        resp = requests.post(f"{BASE_URL}/api/analyze/email", json=data, headers=headers)
        print(f"\nStatus Code: {resp.status_code}")
        
        if resp.status_code == 200:
            result = resp.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            
            # Verify response format
            required_fields = ['verdict', 'score', 'signals', 'warnings']
            missing = [f for f in required_fields if f not in result]
            
            if missing:
                print(f"Missing required fields: {missing}")
                return False
            
            print(f"\nResponse Format Valid")
            print(f"   Verdict: {result['verdict']}")
            print(f"   Score: {result['score']}")
            print(f"   Risk Level: {result.get('risk_level', 'N/A')}")
            return True
        else:
            print(f"Response: {resp.text}")
            return False
            
    except Exception as e:
        print(f"FAILED: {e}")
        return False

def main():
    print("\n" + "TEST " + "="*56)
    print("TEST  PHISHING DETECTION WEBAPP - API TEST SUITE")
    print("TEST " + "="*56)
    
    results = {
        "Health Check": test_health(),
        "URL Analysis": test_url_analysis(),
        "Email Analysis": test_email_analysis()
    }
    
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "PASSED" if passed else "FAILED"
        print(f"{test_name:.<40} {status}")
    
    total = len(results)
    passed = sum(results.values())
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\nAll tests passed! Webapp is working correctly.")
        return 0
    else:
        print(f"\n{total - passed} test(s) failed. Check the output above.")
        return 1

if __name__ == "__main__":
    exit(main())
