import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let parsedError;
      try {
        parsedError = JSON.parse(this.state.errorMsg);
      } catch (e) {
        parsedError = null;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
          <div className="bg-card w-full max-w-lg p-6 rounded-xl shadow-lg border border-error/20">
            <h2 className="text-error font-bold text-[20px] mb-2 flex items-center gap-2">
              ⚠️ Something went wrong
            </h2>
            <div className="text-[14px] text-ink/80 mb-4 bg-error/5 p-4 rounded-md">
              {parsedError ? (
                <>
                  <p><strong>Database Error:</strong> Missing or insufficient permissions.</p>
                  <p className="mt-2 text-muted">Path: <code className="bg-white/50 px-1 rounded">{parsedError.path}</code></p>
                  <p className="text-muted">Operation: <code className="bg-white/50 px-1 rounded">{parsedError.operationType}</code></p>
                </>
              ) : (
                <p>{this.state.errorMsg || "An unexpected error occurred."}</p>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-dark transition-colors font-medium text-[14px]"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
