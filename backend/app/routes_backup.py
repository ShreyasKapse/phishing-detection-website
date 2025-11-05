from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from . import db, bcrypt
from .models import User, Analysis
from .ml.url_analyzer import URLAnalyzer
from .ml.predictor import MLPredictor
from datetime import datetime, timedelta
import json

bp = Blueprint('main', __name__)
url_analyzer = URLAnalyzer()
ml_predictor = MLPredictor()

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
        'endpoints': ['/', '/health', '/api/register', '/api/login', '/api/analyze/url', '/api/analyses', '/api/stats']
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

# User Statistics endpoint
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
