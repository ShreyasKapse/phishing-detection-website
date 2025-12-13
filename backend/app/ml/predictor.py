import numpy as np
import os
import joblib
from typing import Dict

class MLPredictor:
    def __init__(self):
        # Optionally load a real ML model
        model_path = os.path.join(os.path.dirname(__file__), 'models', 'phishing_rf.joblib')
        if os.path.exists(model_path):
            obj = joblib.load(model_path)
            self.sklearn_model = obj['model']
            self.feature_columns = obj['columns']
            self.model_used = 'ml_random_forest'
        else:
            self.sklearn_model = None
            self.feature_columns = None
            self.model_used = 'rule_based'

    def predict_url(self, features: Dict, use_ml: bool = True) -> Dict:
        """
        Make a phishing prediction. If real ML model is loaded and use_ml=True, use it,
        otherwise fallback to the rule-based method.
        """
        # Try ML model prediction
        if self.sklearn_model and use_ml:
            # Ensure feature alignment/order, fill missing with 0
            x = np.array([[features.get(col, 0) for col in self.feature_columns]])
            prob = self.sklearn_model.predict_proba(x)[0][1]
            is_phishing = bool(prob > 0.6)
            risk_level = self._get_risk_level(prob)
            return {
                'is_phishing': is_phishing,
                'confidence': float(min(prob, 0.99)),
                'risk_level': risk_level,
                'model_used': self.model_used,
            }
        else:
            # Fallback to rule-based
            risk_score = self._calculate_url_risk_score(features)
            is_phishing = risk_score > 0.6
            confidence = min(risk_score, 0.95)
            risk_level = self._get_risk_level(risk_score)
            return {
                'is_phishing': is_phishing,
                'confidence': confidence,
                'risk_level': risk_level,
                'model_used': 'rule_based'
            }
    
    def _calculate_url_risk_score(self, features: Dict) -> float:
        # Expanded weighted risk calculation
        weights = {
            # Existing weights
            'has_ip': 0.15,
            'suspicious_keywords': 0.12,
            'has_shortener': 0.08,
            'ssl_valid': -0.10,
            'has_https': -0.05,
            'tld_trust_score': -0.08,
            # New feature weights (customize as needed)
            'domain_entropy': 0.09,            # Higher entropy = more random
            'path_length': 0.007,              # Each char adds small risk
            'query_params_count': 0.03,        # Each param adds risk
            'suspicious_port': 0.09,           # Large risk for strange port
            'has_mx': -0.06,                   # MX record lowers risk
            'has_hyphen': 0.04,
            'double_hyphen': 0.06,
            'has_underscore': 0.08,
            'punycode': 0.11,                  # Looks like xn--
            'https_in_domain': 0.05,           # 'https' in domain name
            # Fallback for stubbed features
            'bad_favicon': 0.02,
        }
        # Base risk
        risk_score = 0.3
        # Apply weighted features
        for feature, weight in weights.items():
            value = features.get(feature, 0)
            # Normalize some features
            if feature == 'domain_entropy' and value:
                # Entropy centered around 3.5: 0.0-1.0 scale
                score = min(max((value - 3.5)/2.0, 0), 1)
                risk_score += score * weight
            elif feature == 'path_length' and value:
                risk_score += min(value, 100) * weight  # Long path risk
            elif feature == 'query_params_count' and value:
                risk_score += min(value, 12) * weight
            elif feature == 'tld_trust_score':
                risk_score -= value * weight
            elif feature == 'has_mx':
                risk_score += (0 if value else 1) * weight
            else:
                risk_score += value * weight
        # Positive bonus for short-lived and suspicious domains
        if features.get('domain_age_days', 9999) < 30:
            risk_score += 0.15
        elif features.get('domain_age_days', 9999) < 365:
            risk_score += 0.05
        # Clamp between 0-1
        return max(0.0, min(1.0, risk_score))
    
    def _get_risk_level(self, risk_score: float) -> str:
        if risk_score < 0.3:
            return 'Low'
        elif risk_score < 0.6:
            return 'Medium'
        elif risk_score < 0.8:
            return 'High'
        else:
            return 'Critical'
    
    def predict_email(self, features: Dict) -> Dict:
        # Placeholder for email prediction
        return {
            'is_phishing': False,
            'confidence': 0.5,
            'risk_level': 'Medium',
            'model_used': self.model_used
        }
