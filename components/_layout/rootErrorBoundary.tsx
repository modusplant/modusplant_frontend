'use client';

import React from 'react';
import RootErrorPage from '@/components/_layout/rootErrorPage';

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return <RootErrorPage error={this.state.error!} reset={this.reset} />;
    }
    return this.props.children;
  }
}
