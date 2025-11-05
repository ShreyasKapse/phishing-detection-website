from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db, bcrypt
from .models import User, Analysis
from .ml.url_analyzer import URLAnalyzer
from .ml.predictor import MLPredictor
from .ml.email_analyzer import EmailAnalyzer
from datetime import datetime, timedelta
import json
from collections import Counter

bp = Blueprint('main', __name__)
url_analyzer = URLAnalyzer()
ml_predictor = MLPredictor()
email_analyzer = EmailAnalyzer()

# Public routes
@bp.route('/')
def hello():
    return {
        'message': 'Phishing Detection API is running!', 
        'status': 'success',
        'version': '1.0.0'
    }

@bp.route('/health')
def health():
    return {
        'status': 'healthy', 
        'service': 'phishing-detector',
        'endpoints': ['/', '/health', '/api/register', '/api/login', '/api/analyze/url', '/api/analyses', '/api/stats', '/api/analytics']
    }

# Authentication routes
@bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            email=data['email'],
            full_name=data.get('full_name', '')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token with user ID as string
        access_token = create_access_token(
            identity=str(user.id),  # Convert to string
            expires_delta=timedelta(days=7)
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            # Update last login
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            # Create access token with user ID as string
            access_token = create_access_token(
                identity=str(user.id),  # Convert to string
                expires_delta=timedelta(days=7)
            )
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict()
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Protected routes
@bp.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))  # Convert back to int
    
    if user:
        return jsonify({
            'message': f'Hello {user.email}!',
            'user': user.to_dict()
        })
    else:
        return jsonify({'error': 'User not found'}), 404

@bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    return jsonify({
        'profile': user.to_dict()
    })

# URL Analysis endpoint
@bp.route('/api/analyze/url', methods=['POST'])
@jwt_required()
def analyze_url():
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        if not data or not data.get('url'):
            return jsonify({'error': 'URL is required'}), 400
        
        url = data['url']
        
        # Analyze URL features
        analysis_result = url_analyzer.analyze(url)
        prediction = ml_predictor.predict_url(analysis_result['features'])
        
        # Save analysis to database
        analysis = Analysis(
            user_id=int(current_user_id),
            analysis_type='url',
            content=url,
            is_phishing=prediction['is_phishing'],
            confidence=prediction['confidence'],
            risk_level=prediction['risk_level'],
            features=json.dumps(analysis_result['features']),
            warnings=json.dumps(analysis_result['warnings']),
            model_used=prediction['model_used']
        )
        
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify({
            'id': analysis.id,
            'is_phishing': prediction['is_phishing'],
            'confidence': prediction['confidence'],
            'risk_level': prediction['risk_level'],
            'model_used': prediction['model_used'],
            'features': analysis_result['features'],
            'warnings': analysis_result['warnings'],
            'analysis_type': 'url',
            'created_at': analysis.created_at.isoformat() if analysis.created_at else None
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Email Analysis endpoint
@bp.route('/api/analyze/email', methods=['POST'])
@jwt_required()
def analyze_email():
    try:
        data = request.get_json()
        subject = data.get('subject', '')
        body = data.get('body', '')
        sender = data.get('from', '')
        reply_to = data.get('reply_to', '')
        analysis_result = email_analyzer.analyze(subject, body, sender, reply_to)
        features = analysis_result['features']

        # Simple rule-based risk scoring for demo
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
        if risk_score < 0.3:
            risk_level = 'Low'
        elif risk_score < 0.6:
            risk_level = 'Medium'
        elif risk_score < 0.8:
            risk_level = 'High'
        else:
            risk_level = 'Critical'
        # Persist analysis
        current_user_id = get_jwt_identity()
        summary_content = f"{sender} — {subject}".strip()
        analysis = Analysis(
            user_id=int(current_user_id),
            analysis_type='email',
            content=summary_content if summary_content else subject or sender or '(email)',
            is_phishing=is_phishing,
            confidence=confidence,
            risk_level=risk_level,
            features=json.dumps(features),
            warnings=json.dumps(analysis_result.get('warnings', [])),
            model_used='rules_email_v1'
        )
        db.session.add(analysis)
        db.session.commit()

        return jsonify({
            'id': analysis.id,
            'is_phishing': is_phishing,
            'confidence': confidence,
            'risk_level': risk_level,
            'features': features,
            'warnings': analysis_result['warnings'],
            'model_used': 'rules_email_v1',
            'analysis_type': 'email',
            'created_at': analysis.created_at.isoformat() if analysis.created_at else None
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Analysis History endpoint
@bp.route('/api/analyses', methods=['GET'])
@jwt_required()
def get_analyses():
    try:
        current_user_id = get_jwt_identity()
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        offset = (page - 1) * limit
        
        # Get user's analyses
        analyses = Analysis.query.filter_by(user_id=int(current_user_id))\
            .order_by(Analysis.created_at.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()
        
        return jsonify({
            'analyses': [analysis.to_dict() for analysis in analyses],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': Analysis.query.filter_by(user_id=int(current_user_id)).count()
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Enhanced Analytics endpoint
@bp.route('/api/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    try:
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id)
        
        # Get basic stats
        total_analyses = Analysis.query.filter_by(user_id=user_id).count()
        phishing_count = Analysis.query.filter_by(user_id=user_id, is_phishing=True).count()
        safe_count = total_analyses - phishing_count
        
        # Get risk level distribution
        risk_distribution = {
            'low': Analysis.query.filter_by(user_id=user_id, risk_level='Low').count(),
            'medium': Analysis.query.filter_by(user_id=user_id, risk_level='Medium').count(),
            'high': Analysis.query.filter_by(user_id=user_id, risk_level='High').count(),
            'critical': Analysis.query.filter_by(user_id=user_id, risk_level='Critical').count()
        }
        
        # Get daily analysis count for the last 7 days
        daily_data = []
        for i in range(6, -1, -1):
            date = datetime.utcnow() - timedelta(days=i)
            start_of_day = datetime(date.year, date.month, date.day)
            end_of_day = start_of_day + timedelta(days=1)
            
            daily_count = Analysis.query.filter(
                Analysis.user_id == user_id,
                Analysis.created_at >= start_of_day,
                Analysis.created_at < end_of_day
            ).count()
            
            daily_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'day': date.strftime('%a'),
                'analyses': daily_count
            })
        
        # Calculate percentages
        safe_percentage = (safe_count / total_analyses * 100) if total_analyses > 0 else 0
        phishing_percentage = (phishing_count / total_analyses * 100) if total_analyses > 0 else 0

        # --- New Analytics for Enhanced Dashboard ---
        analyses = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.created_at.desc()).all()

        # (1) Top 5 risky URLs (by highest confidence, then most recent)
        top_risky_urls = sorted(
            [a for a in analyses if a.analysis_type == 'url'],
            key=lambda x: (x.confidence, x.created_at),
            reverse=True
        )[:5]
        top_risky_urls = [
            {
                'id': a.id,
                'url': a.content,
                'confidence': a.confidence,
                'risk_level': a.risk_level,
                'created_at': a.created_at.isoformat() if a.created_at else None
            }
            for a in top_risky_urls
        ]

        # (1b) Top 5 risky Emails (by highest confidence, then most recent)
        top_risky_emails = sorted(
            [a for a in analyses if a.analysis_type == 'email'],
            key=lambda x: (x.confidence, x.created_at),
            reverse=True
        )[:5]
        top_risky_emails = [
            {
                'id': a.id,
                'summary': a.content,
                'confidence': a.confidence,
                'risk_level': a.risk_level,
                'created_at': a.created_at.isoformat() if a.created_at else None
            }
            for a in top_risky_emails
        ]

        # (2) Feature frequency breakdown
        feature_counter = Counter()
        for a in analyses:
            try:
                features = json.loads(a.features) if a.features else {}
                for k, v in features.items():
                    if isinstance(v, (int, float)) and v:
                        feature_counter[k] += 1
            except Exception:
                continue
        feature_frequency = dict(feature_counter)

        # (3) User activity days for last 30 days
        activity_days = set()
        now = datetime.utcnow()
        for a in analyses:
            if a.created_at >= now - timedelta(days=30):
                day_str = a.created_at.strftime('%Y-%m-%d')
                activity_days.add(day_str)
        activity_days = sorted(activity_days)

        # (4) Warnings histogram across all user's analyses
        warnings_counter = Counter()
        for a in analyses:
            try:
                warnings = json.loads(a.warnings) if a.warnings else []
                for w in warnings:
                    warnings_counter[w] += 1
            except Exception:
                continue
        warnings_frequency = dict(warnings_counter)
        # --- END New Analytics ---

        return jsonify({
            'overview': {
                'total_analyses': total_analyses,
                'safe_analyses': safe_count,
                'phishing_detected': phishing_count,
                'safe_percentage': round(safe_percentage, 1),
                'phishing_percentage': round(phishing_percentage, 1)
            },
            'risk_distribution': risk_distribution,
            'daily_activity': daily_data,
            'user_id': user_id,
            # --- New analytics ---
            'top_risky_urls': top_risky_urls,
            'top_risky_emails': top_risky_emails,
            'feature_frequency': feature_frequency,
            'activity_days': activity_days,
            'warnings_frequency': warnings_frequency
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# User Statistics endpoint (keep for backward compatibility)
@bp.route('/api/stats', methods=['GET'])
@jwt_required()
def get_stats():
    try:
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id)
        
        # Get total analyses count
        total_analyses = Analysis.query.filter_by(user_id=user_id).count()
        
        # Get phishing analyses count
        phishing_count = Analysis.query.filter_by(user_id=user_id, is_phishing=True).count()
        
        # Get URL analyses count
        url_analyses = Analysis.query.filter_by(user_id=user_id, analysis_type='url').count()
        
        # Calculate percentages
        safe_percentage = ((total_analyses - phishing_count) / total_analyses * 100) if total_analyses > 0 else 0
        phishing_percentage = (phishing_count / total_analyses * 100) if total_analyses > 0 else 0
        
        return jsonify({
            'total_analyses': total_analyses,
            'phishing_detected': phishing_count,
            'safe_analyses': total_analyses - phishing_count,
            'url_analyses': url_analyses,
            'safe_percentage': round(safe_percentage, 1),
            'phishing_percentage': round(phishing_percentage, 1),
            'user_id': user_id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@bp.route('/api/test')
def test():
    return {
        'message': 'API test successful',
        'data': {'feature': 'phishing-detection', 'status': 'active'}
    }
