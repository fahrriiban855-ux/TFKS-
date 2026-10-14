import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorTracker } from '../../services/errorTracker';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorId = errorTracker.captureException(error, {
      componentStack: errorInfo.componentStack,
    });
    this.setState({ errorId });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorId: null });
    window.location.hash = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0A0A0C] text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#16161A] border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-white">Beklenmeyen Sistem Hatası</h2>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                Uygulama çalışırken beklenmedik bir arayüz hatası oluştu. Durum izleme servisine mühürlendi.
              </p>
              {this.state.errorId && (
                <div className="text-[10px] font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 text-white/70">
                  Hata Takip Kodu: {this.state.errorId}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0A84FF] hover:bg-[#0071E3] active:scale-[0.98] transition-all text-xs font-semibold text-white flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Yeniden Yükle
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.98] transition-all text-xs font-semibold text-white/90 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Ana Ekran
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
