import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime, timedelta

# Setup
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()
email = 'test_redirect_102@example.com'

try:
    user = auth.get_user_by_email(email)
    uid = user.uid
    print(f"Found user {email} with UID: {uid}")

    history_ref = db.collection('users').document(uid).collection('history')
    
    # Sample scans
    scans = [
        {
            'content': 'https://google.com',
            'is_phishing': False,
            'risk_level': 'Low',
            'confidence': 0.15,
            'analysis_type': 'url',
            'features': {'url_length': 18, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True},
            'warnings': [],
            'created_at': (datetime.utcnow() - timedelta(hours=1)).isoformat()
        },
        {
            'content': 'https://suspicious-login.xyz/verify',
            'is_phishing': True,
            'risk_level': 'High',
            'confidence': 0.92,
            'analysis_type': 'url',
            'features': {'url_length': 35, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': False, 'is_shortened': False},
            'warnings': ['Suspicious domain extension', 'No SSL certificate'],
            'created_at': (datetime.utcnow() - timedelta(hours=2)).isoformat()
        },
        {
            'content': 'https://github.com',
            'is_phishing': False,
            'risk_level': 'Low',
            'confidence': 0.08,
            'analysis_type': 'url',
            'features': {'url_length': 18, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True},
            'warnings': [],
            'created_at': (datetime.utcnow() - timedelta(hours=5)).isoformat()
        },
        {
            'content': 'http://bit.ly/free-money',
            'is_phishing': True,
            'risk_level': 'Critical',
            'confidence': 0.95,
            'analysis_type': 'url',
            'features': {'url_length': 24, 'has_ip_address': False, 'subdomain_count': 1, 'is_shortened': True},
            'warnings': ['Shortened URL detected', 'No HTTPS'],
            'created_at': (datetime.utcnow() - timedelta(days=1)).isoformat()
        },
        {
            'content': 'https://stackoverflow.com',
            'is_phishing': False,
            'risk_level': 'Low',
            'confidence': 0.05,
            'analysis_type': 'url',
            'features': {'url_length': 25, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True},
            'warnings': [],
            'created_at': (datetime.utcnow() - timedelta(days=2)).isoformat()
        }
    ]
    
    for scan in scans:
        scan['user_id'] = uid
        scan['model_used'] = 'seed_script'
        doc_ref = history_ref.add(scan)
        print(f"Added: {scan['content'][:30]}... -> {scan['risk_level']}")
    
    print(f"\nSuccessfully added {len(scans)} sample scans!")
    
except Exception as e:
    print(f"Error: {e}")
