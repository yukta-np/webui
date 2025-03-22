import React from 'react';
import Custom500Component from './error-pages/Custom500';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      console.log(this.state.error);
      return <Custom500Component />;
    }

    // Return children components in case of no error

    return this.props.children;
  }
}

export default ErrorBoundary;
