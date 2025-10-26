// import React, { Component, type ReactNode } from "react";
// import { toast } from "sonner";

// interface Props {
//   children: ReactNode;
// }

// interface State {
//   hasError: boolean;
//   error: Error | null;
// }

// class ErrorBoundary extends Component<Props, State> {
//   state: State = { hasError: false, error: null };

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error("ErrorBoundary:", error, errorInfo);
//     toast.error("An error occurred. Please try again or contact support.");
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="text-center py-12">
//           <h1 className="text-2xl font-bold text-red-600">
//             Something went wrong
//           </h1>
//           <p className="text-muted-foreground">{this.state.error?.message}</p>
//           <button
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//             onClick={() => window.location.reload()}
//           >
//             Reload Page
//           </button>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

import React, { Component, type ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    toast.error("An error occurred. Please try again or contact support.");
    // Avoid any setState here to prevent contributing to update loops
  }

  // Manual reset method to potentially recover without full reload
  // (Use with caution; only if root cause is transient)
  private resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12" key="error-fallback">
          <h1 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            {this.state.error?.message || "Unknown error"}
          </p>
          <div className="mt-4 space-x-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={this.resetError}
            >
              Retry
            </button>
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-sm text-left max-w-md mx-auto">
              <summary className="cursor-pointer">Debug info</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {this.state.error?.stack || "No stack trace"}
              </pre>
            </details>
          )}
        </div>
      );
    }

    // Force remount on children if needed (e.g., via external prop), but optional
    return this.props.children;
  }
}

export default ErrorBoundary;