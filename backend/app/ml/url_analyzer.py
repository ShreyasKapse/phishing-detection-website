import re
import whois
import tldextract
import requests
from urllib.parse import urlparse, parse_qs
import math
import idna
import dns.resolver
from datetime import datetime
import ssl
import socket

class URLAnalyzer:
    def __init__(self):
        self.suspicious_keywords = [
            'login', 'verify', 'account', 'banking', 'paypal', 'ebay',
            'security', 'update', 'confirm', 'password', 'credential'
        ]
        
        self.trusted_tlds = ['.com', '.org', '.net', '.edu', '.gov']
        self.suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.xyz']

    def _shannon_entropy(self, s):
        """Calculate Shannon entropy of a string"""
        import collections
        prob = [n_x/len(s) for x,n_x in collections.Counter(s).items()]
        entropy = -sum([p*math.log(p,2) for p in prob])
        return round(entropy, 3)

    def _has_mx_record(self, domain):
        try:
            answers = dns.resolver.resolve(domain, 'MX')
            return bool(answers)
        except Exception:
            return False

    def analyze(self, url: str) -> dict:
        features = {}
        warnings = []
        try:
            # Basic URL features
            features['url_length'] = len(url)
            features['has_https'] = 1 if url.startswith('https://') else 0
            features['has_ip'] = 1 if self._has_ip_address(url) else 0
            features['special_chars_count'] = self._count_special_chars(url)
            features['suspicious_keywords'] = self._count_suspicious_keywords(url)

            parsed = urlparse(url)
            path = parsed.path or ''
            domain_info = tldextract.extract(url)
            domain = domain_info.registered_domain

            # New features
            features['domain_entropy'] = self._shannon_entropy(domain or '') if domain else 0
            features['path_length'] = len(path)
            features['path_depth'] = path.count('/')
            features['query_length'] = len(parsed.query)
            features['query_params_count'] = len(parse_qs(parsed.query))
            features['suspicious_port'] = 1 if parsed.port and parsed.port not in [80,443,None] else 0

            # Hyphen or underscore checks
            features['has_hyphen'] = 1 if '-' in domain else 0
            features['double_hyphen'] = 1 if '--' in domain else 0
            features['has_underscore'] = 1 if '_' in domain else 0

            # Punycode (xn--) or https in domain
            features['punycode'] = 1 if 'xn--' in domain else 0
            features['https_in_domain'] = 1 if 'https' in domain else 0

            # MX Record in DNS
            features['has_mx'] = 1 if self._has_mx_record(domain) else 0

            # Alexa/global rank (stub)
            features['alexa_rank'] = -1 # stub value; real impl needs API

            # Favicon not on same domain (SKIPPED for now: requires HTML fetch)
            features['bad_favicon'] = 0 # stub for now

            # External resource ratio (SKIPPED for now)
            features['external_resource_ratio'] = -1 # stub

            # Domain analysis
            features['domain_age_days'] = self._get_domain_age(domain)
            features['tld_trust_score'] = self._get_tld_trust_score(domain_info.suffix)
            features['subdomain_count'] = len(domain_info.subdomain.split('.')) if domain_info.subdomain else 0
            
            # Additional features
            features['has_shortener'] = 1 if self._is_shortened_url(url) else 0
            features['redirect_count'] = self._count_redirects(url)
            features['ssl_valid'] = self._check_ssl_certificate(url)
            
            # Warnings for new features
            if features['domain_entropy'] > 4.0:
                warnings.append('Domain name is highly random (entropy high)')
            if features['path_length'] > 50:
                warnings.append('Path is very long')
            if features['query_params_count'] > 6 or features['query_length'] > 80:
                warnings.append('Very long or complex query parameters in URL')
            if features['suspicious_port']:
                warnings.append('Non-standard port used in URL')
            if features['punycode']:
                warnings.append('Punycode (internationalized) domain used (can hide lookalike)')
            if features['https_in_domain']:
                warnings.append('Domain contains \'https\' (URL might be misleading!)')
            if features['bad_favicon']:
                warnings.append('Favicon not hosted on same domain')
            if features['has_hyphen'] and features['double_hyphen']:
                warnings.append('Multiple hyphens in domain are suspicious')
            if features['has_underscore']:
                warnings.append('Underscore used in domain (rare, likely phishing)')
            if not features['has_mx']:
                warnings.append('No MX record (domain likely not legit mail sender)')
            # Generate warnings
            if features['has_ip']:
                warnings.append('URL contains IP address instead of domain name')
            if features['special_chars_count'] > 5:
                warnings.append('High number of special characters in URL')
            if features['suspicious_keywords'] > 2:
                warnings.append('Multiple suspicious keywords detected')
            if features['domain_age_days'] < 30:
                warnings.append('Domain is very new (less than 30 days)')
            if features['subdomain_count'] > 2:
                warnings.append('Multiple subdomains detected')
            if features['has_shortener']:
                warnings.append('URL uses shortening service')
                
        except Exception as e:
            warnings.append(f'Analysis error: {str(e)}')
            
        return {
            'features': features,
            'warnings': warnings
        }

    def _has_ip_address(self, url: str) -> bool:
        ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        return bool(re.search(ip_pattern, url))

    def _count_special_chars(self, url: str) -> int:
        special_chars = r'[!@#$%^&*()_+\-=\[\]{};\':\"\\|,.<>/?]'
        return len(re.findall(special_chars, url))

    def _count_suspicious_keywords(self, url: str) -> int:
        count = 0
        for keyword in self.suspicious_keywords:
            if keyword.lower() in url.lower():
                count += 1
        return count

    def _get_tld_trust_score(self, tld: str) -> float:
        if f'.{tld}' in self.trusted_tlds:
            return 1.0
        elif f'.{tld}' in self.suspicious_tlds:
            return 0.0
        else:
            return 0.5

    def _is_shortened_url(self, url: str) -> bool:
        shorteners = ['bit.ly', 'goo.gl', 'tinyurl.com', 't.co', 'ow.ly']
        return any(shortener in url for shortener in shorteners)

    def _get_domain_age(self, domain: str) -> float:
        try:
            domain_info = whois.whois(domain)
            if domain_info.creation_date:
                if isinstance(domain_info.creation_date, list):
                    creation_date = domain_info.creation_date[0]
                else:
                    creation_date = domain_info.creation_date
                
                if creation_date:
                    age_days = (datetime.now() - creation_date).days
                    return float(age_days)
        except Exception as e:
            print(f'Domain age check failed for {domain}: {e}')
        return 0.0

    def _count_redirects(self, url: str) -> int:
        try:
            response = requests.get(url, timeout=5, allow_redirects=False)
            return len(response.history) if response.history else 0
        except:
            return 0

    def _check_ssl_certificate(self, url: str) -> int:
        try:
            hostname = urlparse(url).hostname
            if not hostname:
                return 0
                
            context = ssl.create_default_context()
            with socket.create_connection((hostname, 443), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    certificate = ssock.getpeercert()
                    return 1 if certificate else 0
        except:
            return 0
