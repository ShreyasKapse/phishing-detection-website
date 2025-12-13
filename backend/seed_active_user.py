import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta

# Setup
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Use the UID from the debug log
uid = 'hOpIJ0s9SAOYylb4g1PDqkGX3LC2'
print(f"Seeding data for UID: {uid}")

history_ref = db.collection('users').document(uid).collection('history')

# Sample scans
scans = [
    {
        'content': 'https://google.com',
        'is_phishing': False,
        'risk_level': 'Low',
        'confidence': 0.15,
        'analysis_type': 'url',
        'features': {'url_length': 18, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True, 'special_char_count': 0, 'is_shortened': False},
        'warnings': [],
        'created_at': (datetime.utcnow() - timedelta(hours=1)).isoformat()
    },
    {
        'content': 'https://suspicious-login.xyz/verify',
        'is_phishing': True,
        'risk_level': 'High',
        'confidence': 0.92,
        'analysis_type': 'url',
        'features': {'url_length': 35, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': False, 'is_shortened': False, 'special_char_count': 3},
        'warnings': ['Suspicious domain extension', 'No SSL certificate'],
        'created_at': (datetime.utcnow() - timedelta(hours=2)).isoformat()
    },
    {
        'content': 'https://github.com',
        'is_phishing': False,
        'risk_level': 'Low',
        'confidence': 0.08,
        'analysis_type': 'url',
        'features': {'url_length': 18, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True, 'special_char_count': 0, 'is_shortened': False},
        'warnings': [],
        'created_at': (datetime.utcnow() - timedelta(hours=5)).isoformat()
    },
    {
        'content': 'http://bit.ly/free-money',
        'is_phishing': True,
        'risk_level': 'Critical',
        'confidence': 0.95,
        'analysis_type': 'url',
        'features': {'url_length': 24, 'has_ip_address': False, 'subdomain_count': 1, 'is_shortened': True, 'special_char_count': 2, 'has_valid_ssl': False},
        'warnings': ['Shortened URL detected', 'No HTTPS'],
        'created_at': (datetime.utcnow() - timedelta(days=1)).isoformat()
    },
    {
        'content': 'https://stackoverflow.com',
        'is_phishing': False,
        'risk_level': 'Low',
        'confidence': 0.05,
        'analysis_type': 'url',
        'features': {'url_length': 25, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True, 'special_char_count': 0, 'is_shortened': False},
        'warnings': [],
        'created_at': (datetime.utcnow() - timedelta(days=2)).isoformat()
    },
    {
        'content': 'https://wikipedia.org',
        'is_phishing': False,
        'risk_level': 'Low',
        'confidence': 0.03,
        'analysis_type': 'url',
        'features': {'url_length': 21, 'has_ip_address': False, 'subdomain_count': 1, 'has_valid_ssl': True, 'special_char_count': 0, 'is_shortened': False},
        'warnings': [],
        'created_at': (datetime.utcnow() - timedelta(days=3)).isoformat()
    }
]

for scan in scans:
    scan['user_id'] = uid
    scan['model_used'] = 'seed_script_v2'
    doc_ref = history_ref.add(scan)
    print(f"✓ Added: {scan['content'][:40]}... -> {scan['risk_level']}")

print(f"\n✅ Successfully added {len(scans)} scans for the active user!")
