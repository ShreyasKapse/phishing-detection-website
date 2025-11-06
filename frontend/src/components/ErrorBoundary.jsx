import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can send error details to an external monitoring service here
    // For now, log to console so it's visible in Vercel's browser console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <div className="max-w-lg bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">An unexpected error occurred. Check the browser console for details.</p>
            <pre className="text-xs text-left bg-gray-100 p-3 rounded overflow-x-auto mb-4">{String(this.state.error)}</pre>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >Reload</button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
