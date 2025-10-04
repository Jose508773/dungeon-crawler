import React from 'react';
import { Button } from '@/components/ui/button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Game Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Reset error state and reload
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Error fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center p-4">
          <div className="fantasy-panel-enhanced p-8 max-w-2xl text-center">
            <h1 className="game-title text-2xl mb-4">⚠️ Game Error</h1>
            <p className="fantasy-text text-sm mb-4 text-gray-300">
              Something went wrong with the game. This error has been logged.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <div className="fantasy-panel p-4 mb-4 text-left overflow-auto max-h-64">
                <p className="fantasy-text text-xs text-red-400 mb-2">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="fantasy-text text-[10px] text-gray-400 overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                className="pixel-btn px-6 py-3"
              >
                🔄 Reload Game
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="pixel-btn px-6 py-3"
              >
                🏠 Go Home
              </Button>
            </div>
            
            <p className="fantasy-text text-xs text-gray-500 mt-4">
              If this problem persists, try clearing your browser cache.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

