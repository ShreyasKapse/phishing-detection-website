import firebase_admin
from firebase_admin import firestore
from datetime import datetime

class FirestoreService:
    def __init__(self):
        self.mock_mode = False
        try:
            self.db = firestore.client()
            with open('debug_log.txt', 'a') as f:
                f.write("FIRESTORE INIT SUCCESS\n")
        except Exception as e:
            with open('debug_log.txt', 'a') as f:
                f.write(f"FIRESTORE INIT FAILED: {str(e)}\n")
            print(f"Warning: Firestore init failed ({e}). Service running in MOCK MODE.")
            self.mock_mode = True
            self.mock_db = {} # Simple in-memory store for session

    def add_history(self, user_id, analysis_data):
        """
        Adds an analysis record to users/{uid}/history collection.
        """
        if self.mock_mode:
            print(f"[MOCK POST] Adding history for {user_id}: {analysis_data}")
            # Simulate ID
            mock_id = f"mock_history_{int(datetime.utcnow().timestamp())}"
            analysis_data['id'] = mock_id
            if user_id not in self.mock_db:
                self.mock_db[user_id] = []
            self.mock_db[user_id].append(analysis_data)
            return mock_id

        try:
            # Ensure timestamp is present
            if 'created_at' not in analysis_data:
                analysis_data['created_at'] = datetime.utcnow().isoformat()
            
            # Add to subcollection
            doc_ref = self.db.collection('users').document(user_id).collection('history').document()
            analysis_data['id'] = doc_ref.id
            doc_ref.set(analysis_data)
            return doc_ref.id
        except Exception as e:
            print(f"Error adding history: {e}")
            raise e

    def get_history(self, user_id, limit=10, start_after=None):
        """
        Retrieves history for a user.
        """
        if self.mock_mode:
            with open('debug_log.txt', 'a') as f:
                f.write(f"GET_ANALYSES (MOCK): Returning {len(self.mock_db.get(user_id, []))} items\n")
            print(f"[MOCK GET] fetching history for {user_id}")
            return self.mock_db.get(user_id, [])[:limit]

        try:
            with open('debug_log.txt', 'a') as f:
                 f.write(f"GET_ANALYSES (REAL): Querying for {user_id}\n")
            
            query = self.db.collection('users').document(user_id).collection('history')\
                .order_by('created_at', direction=firestore.Query.DESCENDING)\
                .limit(limit)
            
            if start_after:
                query = query.start_after(start_after)
                
            docs = query.stream()
            results = [doc.to_dict() for doc in docs]
            
            with open('debug_log.txt', 'a') as f:
                 f.write(f"GET_ANALYSES (REAL): Found {len(results)} docs\n")
                 
            return results
        except Exception as e:
            print(f"Error getting history: {e}")
            raise e

    def get_analytics(self, user_id):
        """
        Computes analytics for a user.
        """
        if self.mock_mode:
             analyses = self.mock_db.get(user_id, [])
             total_analyses = len(analyses)
             phishing_count = sum(1 for a in analyses if a.get('is_phishing'))
             risk_counts = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
             for a in analyses:
                risk = a.get('risk_level', 'low').lower()
                if risk in risk_counts:
                    risk_counts[risk] += 1
             return {
                'total_analyses': total_analyses,
                'phishing_count': phishing_count,
                'risk_distribution': risk_counts,
                'recent_analyses': analyses[:5]
            }

        try:
             # Basic implementation fetching all docs (optimize later for production)
            history_ref = self.db.collection('users').document(user_id).collection('history')
            docs = history_ref.stream()
            
            analyses = [doc.to_dict() for doc in docs]
            
            total_analyses = len(analyses)
            phishing_count = sum(1 for a in analyses if a.get('is_phishing'))
            
            # Simple risk distribution
            risk_counts = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
            for a in analyses:
                risk = a.get('risk_level', 'low').lower()
                if risk in risk_counts:
                    risk_counts[risk] += 1
            
            return {
                'total_analyses': total_analyses,
                'phishing_count': phishing_count,
                'risk_distribution': risk_counts,
                # Pass raw analyses for granular frontend processing if needed, or process here
                'recent_analyses': analyses[:5] 
            }
        except Exception as e:
            print(f"Error getting analytics: {e}")
            raise e
