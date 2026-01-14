from flask import Blueprint, request, jsonify, g
from .auth_middleware import require_firebase_token
from .firestore_service import FirestoreService
from .ml.url_analyzer import URLAnalyzer
from .ml.predictor import MLPredictor
from .ml.email_analyzer import EmailAnalyzer
import json
from datetime import datetime

bp = Blueprint('main', __name__)
url_analyzer = URLAnalyzer()
ml_predictor = MLPredictor()
email_analyzer = EmailAnalyzer()
firestore_service = FirestoreService()

# Public routes
@bp.route('/')
def hello():
    return {
        'message': 'Phishing Detection API is running (Firebase Mode)!', 
        'status': 'success',
        'version': '2.0.0'
    }

@bp.route('/health')
def health():
    return {
        'status': 'healthy', 
        'service': 'phishing-detector',
        'mode': 'firebase'
    }

# Analysis Endpoints (Protected)

@bp.route('/api/analyze/url', methods=['POST'])
@require_firebase_token
def analyze_url():
    try:
        data = request.get_json()
        with open('debug_log.txt', 'a') as f:
            f.write(f"ANALYZE_URL: User {g.user_id}, Payload {data}\n")
            
        print(f"DEBUG: Analyze URL request received. Payload: {data}")
        print(f"DEBUG: Auth User ID: {g.user_id}")
        
        if not data or not data.get('url'):
            print("DEBUG: Error - No URL provided")
            return jsonify({'error': 'URL is required'}), 400
        
        url = data['url']
        print(f"DEBUG: Processing URL: {url}")
        
        # Analyze URL features
        analysis_result = url_analyzer.analyze(url)
        print(f"DEBUG: Analysis Result features: {analysis_result['features']}")
        
        prediction = ml_predictor.predict_url(analysis_result['features'])
        print(f"DEBUG: Prediction result: {prediction}")
        
        # Prepare data for Firestore
        analysis_data = {
            'user_id': g.user_id,
            'analysis_type': 'url',
            'content': url,
            'is_phishing': bool(prediction['is_phishing']),
            'confidence': float(prediction['confidence']),
            'risk_level': prediction['risk_level'],
            'features': analysis_result['features'],
            'warnings': analysis_result['warnings'],
            'model_used': prediction['model_used'],
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Save to Firestore
        doc_id = firestore_service.add_history(g.user_id, analysis_data, user_email=g.user_email)
        with open('debug_log.txt', 'a') as f:
            f.write(f"ANALYZE_URL: Saved Doc ID {doc_id}\n")
        print(f"DEBUG: Saved to Firestore with ID: {doc_id}")
        
        # Construct response in requested format
        return jsonify({
            'success': True,
            'verdict': 'Phishing' if prediction['is_phishing'] else 'Safe',
            'score': prediction['confidence'],
            'risk_level': prediction['risk_level'], # Keep this as it's useful
            'signals': analysis_result['features'], # Features -> Signals
            'warnings': analysis_result['warnings'],
            'id': doc_id
        })
        
    except Exception as e:
        with open('debug_log.txt', 'a') as f:
            f.write(f"ANALYZE_URL ERROR: {str(e)}\n")
        print(f"ERROR in analyze_url: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@bp.route('/api/analyze/email', methods=['POST'])
@require_firebase_token
def analyze_email():
    try:
        data = request.get_json()
        print(f"DEBUG: Analyze Email request. Payload keys: {data.keys()}")
        
        subject = data.get('subject', '')
        body = data.get('body', '')
        sender = data.get('from', '')
        reply_to = data.get('reply_to', '')
        
        analysis_result = email_analyzer.analyze(subject, body, sender, reply_to)
        features = analysis_result['features']
        print(f"DEBUG: Email Features: {features}")

        # Rule-based scoring (Same as before)
        risk_score = (
            features.get('subject_keywords', 0) * 0.2 +
            features.get('body_keywords', 0) * 0.15 +
            features.get('link_count', 0) * 0.12 +
            features.get('suspicious_attach_count', 0) * 0.25 +
            features.get('from_free_domain', 0) * 0.10 +
            features.get('from_odd_tld', 0) * 0.10 +
            features.get('reply_to_mismatch', 0) * 0.18 +
            features.get('generic_greeting', 0) * 0.08 +
            features.get('html_tag_count', 0) * 0.02
        )
        risk_score = min(1.0, risk_score)
        is_phishing = risk_score > 0.5
        confidence = round(risk_score, 2)
        print(f"DEBUG: Email Score: {risk_score}, Phishing: {is_phishing}")
        
        if risk_score < 0.3: risk_level = 'Low'
        elif risk_score < 0.6: risk_level = 'Medium'
        elif risk_score < 0.8: risk_level = 'High'
        else: risk_level = 'Critical'

        summary_content = f"{sender} — {subject}".strip()
        
        # Prepare data for Firestore
        analysis_data = {
            'user_id': g.user_id,
            'analysis_type': 'email',
            'content': summary_content if summary_content else subject or sender or '(email)',
            'from': sender,
            'subject': subject,
            'reply_to': reply_to,
            'is_phishing': bool(is_phishing),
            'confidence': float(confidence),
            'risk_level': risk_level,
            'features': features,
            'warnings': analysis_result.get('warnings', []),
            'model_used': 'rules_email_v1',
            'created_at': datetime.utcnow().isoformat()
        }
        
        doc_id = firestore_service.add_history(g.user_id, analysis_data, user_email=g.user_email)

        # Return in requested format
        return jsonify({
            'success': True,
            'verdict': 'Phishing' if is_phishing else 'Safe',
            'score': confidence,
            'risk_level': risk_level,
            'signals': features,
            'warnings': analysis_result['warnings'],
            'id': doc_id
        })

    except Exception as e:
        print(f"ERROR in analyze_email: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

@bp.route('/api/analyze/url/batch', methods=['POST'])
@require_firebase_token
def analyze_url_batch():
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if not urls or not isinstance(urls, list):
            return jsonify({'error': 'List of URLs is required'}), 400
            
        if len(urls) > 50:
            return jsonify({'error': 'Batch size limit exceeded (max 50)'}), 400
            
        results = []
        for url in urls:
            try:
                # Reuse existing logic (simplified)
                analysis_result = url_analyzer.analyze(url)
                prediction = ml_predictor.predict_url(analysis_result['features'])
                
                # Saving to history:
                analysis_data = {
                    'user_id': g.user_id,
                    'analysis_type': 'url',
                    'content': url,
                    'is_phishing': bool(prediction['is_phishing']),
                    'confidence': float(prediction['confidence']),
                    'risk_level': prediction['risk_level'],
                    'features': analysis_result['features'],
                    'warnings': analysis_result['warnings'],
                    'model_used': prediction['model_used'],
                    'created_at': datetime.utcnow().isoformat()
                }
                doc_id = firestore_service.add_history(g.user_id, analysis_data, user_email=g.user_email)
                
                results.append({
                    'url': url,
                    'status': 'success',
                    'verdict': 'Phishing' if prediction['is_phishing'] else 'Safe',
                    'score': prediction['confidence'],
                    'risk_level': prediction['risk_level'],
                    'id': doc_id
                })
            except Exception as e:
                results.append({
                    'url': url,
                    'status': 'error',
                    'error': str(e)
                })
                
        return jsonify({
            'success': True,
            'results': results,
            'total': len(urls),
            'processed': len(results)
        })
        
    except Exception as e:
        print(f"ERROR in analyze_url_batch: {e}")
        return jsonify({'error': str(e)}), 400

@bp.route('/api/analyses', methods=['GET'])
@require_firebase_token
def get_analyses():
    try:
        limit = request.args.get('limit', 10, type=int)
        # Offset/StartAfter not fully implemented in this simple version, but service supports it structure-wise
        analyses = firestore_service.get_history(g.user_id, limit=limit)
        with open('debug_log.txt', 'a') as f:
            f.write(f"GET_ANALYSES: User {g.user_id} found {len(analyses)} items\n")
            if len(analyses) > 0:
                 f.write(f"   First Item Keys: {analyses[0].keys()}\n")
        return jsonify({'analyses': analyses})
    except Exception as e:
        with open('debug_log.txt', 'a') as f:
            f.write(f"GET_ANALYSES ERROR: {str(e)}\n")
        return jsonify({'error': str(e)}), 400

@bp.route('/api/analytics', methods=['GET'])
@require_firebase_token
def get_analytics():
    try:
        # For full dashboard compatibility, we might need to map the new Firestore structure 
        # to the exact expected JSON format of the Dashboard.
        # But for now, let's return what our Firestore service gives, 
        # and we might need to adjust the Frontend or Service to match.
        analytics = firestore_service.get_analytics(g.user_id)
        
        # Construct the response expected by Frontend Dashboard
        # Note: Some advanced charts (daily activity, top risky) might need more processing
        # if the service only returns basic stats.
        # I'll update the service logic later if needed, but for now passing basic stats.
        
        # Mocking detailed data if service doesn't provide it yet
        # or implementing it fast in Python
        raw_analyses = analytics.get('recent_analyses', [])
        
        return jsonify({
            'overview': {
                'total_analyses': analytics['total_analyses'],
                'safe_analyses': analytics['total_analyses'] - analytics['phishing_count'],
                'phishing_detected': analytics['phishing_count'],
                 # Safe percentage
                'safe_percentage': round(((analytics['total_analyses'] - analytics['phishing_count'])/analytics['total_analyses']*100), 1) if analytics['total_analyses'] > 0 else 0,
                'phishing_percentage': round((analytics['phishing_count']/analytics['total_analyses']*100), 1) if analytics['total_analyses'] > 0 else 0
            },
            'risk_distribution': analytics['risk_distribution'],
            # Placeholders for advanced charts to prevent frontend crash
            'daily_activity': [], 
            'top_risky_urls': [],
            'top_risky_emails': [],
            'feature_frequency': {},
            'warnings_frequency': {},
            'activity_days': []
        })
        
    except Exception as e:
        print(f"Error in analytics: {e}")
        return jsonify({'error': str(e)}), 400
