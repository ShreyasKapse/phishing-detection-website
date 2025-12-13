import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from datetime import datetime

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

    # Add Data
    history_ref = db.collection('users').document(uid).collection('history')
    
    data = {
        'user_id': uid,
        'analysis_type': 'url',
        'content': 'https://seeded-prediction.com',
        'is_phishing': True,
        'risk_level': 'High',
        'confidence': 0.95,
        'created_at': datetime.utcnow().isoformat(),
        'model_used': 'manual_seed'
    }
    
    doc_ref = history_ref.add(data)
    print(f"Successfully added document ID: {doc_ref[1].id}")
    
except Exception as e:
    print(f"Error: {e}")
