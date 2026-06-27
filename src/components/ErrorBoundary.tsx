import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };


  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 select-none font-sans"
          id="error-boundary-screen"
        >
          {/* Ambient Background Spot */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />

          <div className="max-w-xl w-full border border-white/10 bg-black p-8 md:p-12 space-y-8 relative text-center">
            {/* Top warning outline */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500/50 animate-pulse" />

            <div className="space-y-4">
              <div className="w-12 h-12 border border-red-500/20 bg-red-500/5 flex items-center justify-center mx-auto text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 block uppercase">
                CRITICAL_SYSTEM_RECONCILIATION_FAIL
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                EXECUTION INTERRUPTED
              </h1>
              <p className="text-xs font-sans font-light text-white/60 leading-relaxed max-w-sm mx-auto">
                The layout engine encountered an unexpected matrix mismatch during runtime rendering sequences.
              </p>
            </div>

            {this.state.error && (
              <div className="border border-white/[0.06] bg-white/[0.01] p-4 text-left font-mono text-[10px] text-white/50 max-h-40 overflow-y-auto space-y-2 select-text">
                <div className="text-red-400 font-bold">[ERROR]: {this.state.error.message}</div>
                {this.state.error.stack && (
                  <pre className="whitespace-pre-wrap text-[9px] text-white/30 leading-normal">
                    {this.state.error.stack.split('\n').slice(0, 3).join('\n')}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-white text-black font-mono text-[10px] tracking-widest font-semibold py-3 px-6 uppercase border border-white hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-2 rounded-none"
                id="error-reset-trigger"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RELOAD_SYSTEM</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="bg-black text-white font-mono text-[10px] tracking-widest font-semibold py-3 px-6 uppercase border border-white/20 hover:border-white transition-all duration-300 flex items-center justify-center gap-2 rounded-none"
                id="error-home-trigger"
              >
                <Home className="w-3.5 h-3.5" />
                <span>RETURN_HOME</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
