import { Component } from 'react';

class ErrorBoundary extends Component<any, any> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }

  render() {
    return this.state.hasError
      ? `A fatal error has occurred, refreshing in 3 seconds...\n${this.state.error}`
      : this.props.children;
  }
}

export default ErrorBoundary;
