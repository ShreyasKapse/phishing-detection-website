import requests
import json

BASE_URL = "http://localhost:5000"

def test_health():
    try:
        resp = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {resp.status_code}")
        print(resp.json())
        return resp.status_code == 200
    except Exception as e:
        print(f"Health Check Failed: {e}")
        return False

def test_analyze():
    try:
        headers = {"Authorization": "Bearer mock_token"}
        data = {"url": "http://suspicious-site.com"}
        resp = requests.post(f"{BASE_URL}/api/analyze/url", json=data, headers=headers)
        print(f"Analyze Check: {resp.status_code}")
        print(json.dumps(resp.json(), indent=2))
        return resp.status_code == 200
    except Exception as e:
        print(f"Analyze Check Failed: {e}")
        return False

if __name__ == "__main__":
    h = test_health()
    a = test_analyze()
    if h and a:
        print("VERIFICATION SUCCESSFUL")
    else:
        print("VERIFICATION FAILED")
