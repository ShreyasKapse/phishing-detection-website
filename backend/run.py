import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    
    # Run the application
    print(f"Starting Phishing Detection API on port {port}...")
    print(f"Debug mode: {app.config['DEBUG']}")
    print(f"Visit: http://localhost:{port}")
    print("Press CTRL+C to stop the server")
    
    is_debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    app.run(
        host='0.0.0.0', 
        port=port, 
        debug=is_debug
    )
