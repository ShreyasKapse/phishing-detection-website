import re
from urllib.parse import urlparse

class EmailAnalyzer:
    def __init__(self):
        self.suspicious_keywords = [
            'verify', 'urgent', 'immediately', 'account', 'password', 'update', 'click',
            'security', 'bank', 'login', 'confirm', 'reset', 'locked', 'attention',
            'alert', 'suspend', 'dear customer', 'dear user', 'action required'
        ]
        self.free_domains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com'
        ]
        self.suspicious_exts = ['.exe', '.scr', '.bat', '.zip', '.js', '.jar']

    def analyze(self, subject: str, body: str, sender: str, reply_to: str = None):
        features = {}
        warnings = []

        # (1) Suspicious keyword counts
        subject_low = (subject or '').lower()
        body_low = (body or '').lower()
        features['subject_keywords'] = sum(1 for k in self.suspicious_keywords if k in subject_low)
        features['body_keywords'] = sum(1 for k in self.suspicious_keywords if k in body_low)

        if features['subject_keywords'] > 2:
            warnings.append("Many suspicious keywords in subject")
        if features['body_keywords'] > 3:
            warnings.append("Multiple phishing-related words in email body")

        # (2) Link/URL analysis in body
        urls = re.findall(r'https?://\S+', body or '')
        features['link_count'] = len(urls)
        if features['link_count'] > 4:
            warnings.append("Lots of links detected (common in phishing)")
        
        # (3) Suspicious attachments (simulate by text)
        attach_exts = [e for e in self.suspicious_exts if e in (body or ' ').lower()]
        features['suspicious_attach_count'] = len(attach_exts)
        if features['suspicious_attach_count']:
            warnings.append("Possible suspicious attachment type mentioned")

        # (4) Sender domain analysis
        sender_dom = sender.split('@')[-1] if sender and '@' in sender else ''
        features['from_free_domain'] = 1 if sender_dom in self.free_domains else 0
        features['from_odd_tld'] = int(sender_dom.split('.')[-1] not in ['com', 'org', 'net', 'edu', 'gov']) if '.' in sender_dom else 0
        if features['from_free_domain']:
            warnings.append("Sender uses free/public email domain")
        if features['from_odd_tld']:
            warnings.append("Sender domain from suspicious TLD")

        # (5) Reply-to mismatch
        features['reply_to_mismatch'] = 0
        if reply_to and sender and sender.lower() != reply_to.lower():
            features['reply_to_mismatch'] = 1
            warnings.append("Reply-to address is different from sender (common phishing trick)")

        # (6) Greeting
        if re.search(r'dear (user|customer|client|member)', body_low):
            warnings.append("Generic greeting detected")
            features['generic_greeting'] = 1
        else:
            features['generic_greeting'] = 0

        # (7) Excess HTML tags
        features['html_tag_count'] = len(re.findall(r'<\w+', body or ''))
        if features['html_tag_count'] > 25:
            warnings.append("Excess HTML tags (hidden content)")

        return {
            'features': features,
            'warnings': warnings
        }
