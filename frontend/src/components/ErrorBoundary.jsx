import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded text-sm overflow-auto max-w-full">
          <strong>Animation Error:</strong> {this.state.error?.message || 'Unknown error'}
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
