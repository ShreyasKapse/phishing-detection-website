import firebase_admin
from firebase_admin import credentials, firestore, auth

# Setup
if not firebase_admin._apps:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Check all users
print("=== All Users ===")
for user in auth.list_users().iterate_all():
    print(f"Email: {user.email}, UID: {user.uid}")
    
    # Check their history count
    history_ref = db.collection('users').document(user.uid).collection('history')
    count = len(list(history_ref.stream()))
    print(f"  -> Has {count} scans\n")
