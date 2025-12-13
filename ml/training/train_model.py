import os
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import requests
import sys
import zipfile
import io
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/app/ml')))
from url_analyzer import URLAnalyzer

PHISHING_URLS_TXT = 'https://openphish.com/feed.txt'
TRANCO_TOP1M_ZIP = 'https://tranco-list.eu/top-1m.csv.zip'

# 1. Download phishing URLs (OpenPhish feed)
print('Downloading phishing URLs...')
try:
    phishing_text = requests.get(PHISHING_URLS_TXT, timeout=20).text
    phishing_urls = [l.strip() for l in phishing_text.splitlines() if l.strip() and l.startswith('http')]
    print(f'Loaded {len(phishing_urls)} phishing URLs')
except Exception as e:
    print('Failed to download phishing URLs:', e)
    phishing_urls = []

# Download top 1M (Tranco) for benign
print('Downloading top-1M benign sites...')
try:
    r = requests.get(TRANCO_TOP1M_ZIP, timeout=30)
    z = zipfile.ZipFile(io.BytesIO(r.content))
    csvfilename = z.namelist()[0]
    dfbenign = pd.read_csv(z.open(csvfilename))
    # Tranco list columns: rank, domain
    domains = dfbenign['domain'].tolist()
    benign_urls = [f'http://{d}' for d in domains[:2000]]  # 2000 is a reasonable size
    print('Loaded', len(benign_urls), 'benign URLs')
except Exception as e:
    print('Failed to download benign URLs:', e)
    benign_urls = []

phishtank = pd.DataFrame({'url': phishing_urls})
be_df = pd.DataFrame({'url': benign_urls})
phishtank['label'] = 1
be_df['label'] = 0

data = pd.concat([phishtank, be_df], ignore_index=True)
data = data.sample(frac=1, random_state=42).reset_index(drop=True)

analyzer = URLAnalyzer()
features_list = []
labels = []
errors = 0
for idx, row in data.iterrows():
    url = row['url']
    label = row['label']
    try:
        result = analyzer.analyze(url)
        features = result['features']
        features_list.append(features)
        labels.append(label)
    except Exception as e:
        errors += 1
        continue
print(f'Feature extraction complete. {len(features_list)} samples. {errors} errors.')

X = pd.DataFrame(features_list)
y = labels
print('Feature columns:')
print(list(X.columns))

# 3. Train Model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)
y_prob = clf.predict_proba(X_test)[:,1]
print('Model Performance:')
print(classification_report(y_test, y_pred))
print('ROC-AUC:', roc_auc_score(y_test, y_prob))

os.makedirs('../../backend/app/ml/models', exist_ok=True)
model_path = '../../backend/app/ml/models/phishing_rf.joblib'
joblib.dump({'model': clf, 'columns': list(X.columns)}, model_path)
print('Model saved to', model_path)
