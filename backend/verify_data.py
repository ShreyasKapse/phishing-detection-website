import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

# Setup
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()
email = 'test_redirect_102@example.com'

try:
    user = auth.get_user_by_email(email)
    uid = user.uid
    print(f"UID: {uid}")

    # Get Data
    history_ref = db.collection('users').document(uid).collection('history')
    docs = history_ref.stream()
    
    count = 0
    for doc in docs:
        print(f"Doc {doc.id}: {doc.to_dict()}")
        count += 1
    
    print(f"Total documents: {count}")
    
except Exception as e:
    print(f"Error: {e}")
