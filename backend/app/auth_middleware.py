from functools import wraps
from flask import request, jsonify, g
import firebase_admin
from firebase_admin import auth, credentials
import os

# Initialize Firebase Admin
# For local development, set FORCE_MOCK_AUTH=true to bypass Firebase token verification
# Or place serviceAccountKey.json in the backend directory.

# Check for service account key
FORCE_MOCK_AUTH = os.environ.get('FORCE_MOCK_AUTH', 'false').lower() == 'true'
key_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'serviceAccountKey.json')

if os.path.exists(key_path) and not FORCE_MOCK_AUTH:
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = key_path
    print(f"Found service account key at: {key_path}")

MOCK_MODE = FORCE_MOCK_AUTH 

if not FORCE_MOCK_AUTH:
    try:
        if not firebase_admin._apps:
            # It will now use the GOOGLE_APPLICATION_CREDENTIALS env var we likely set above
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized successfully (Real Auth Mode)")
    except Exception as e:
        print(f"Firebase Admin init failed ({e}). Running in MOCK MODE.")
        print("   All authentication will use mock user: mock_user_123")
        MOCK_MODE = True
else:
    print("FORCE_MOCK_AUTH is enabled. Running in MOCK MODE.")
    print("   All authentication will use mock user: mock_user_123")
    print("   Set FORCE_MOCK_AUTH=false (or provide serviceAccountKey.json) to use real Firebase verification")

def require_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization header is missing'}), 401
        
        try:
            token = auth_header.split(" ")[1]
            
            # If in Mock Mode, accept ANY token without verification
            # This allows testing without Firebase credentials
            if MOCK_MODE:
                print(f"[MOCK AUTH] Accepting token for mock user (first 20 chars): {token[:20]}...")
                g.user_id = 'mock_user_123'
                g.user_email = 'mock@example.com'
                return f(*args, **kwargs)

            # Normal Firebase verification (only when credentials are available)
            decoded_token = auth.verify_id_token(token)
            g.user_id = decoded_token['uid']
            g.user_email = decoded_token.get('email')
            print(f"[AUTH] Verified user: {g.user_id}")
            
            print(f"[AUTH SUCCESS] User {g.user_id}")
            
        except Exception as e:
            print(f"[AUTH ERROR] {str(e)}")
            print(f"[AUTH ERROR] {e}")
            return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 401
            
        return f(*args, **kwargs)
    return decorated_function
