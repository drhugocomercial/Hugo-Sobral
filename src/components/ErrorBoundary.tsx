import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('is_hugo_admin');
    (this as any).setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    const self = this as any;
    const { fallbackTitle, fallbackMessage, children } = self.props;
    const { hasError, error } = self.state;

    if (hasError) {
      return (
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-gold-300 p-8 shadow-luxury relative text-center">
            {/* Elegant luxury top border ornament */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
            
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gold-50/50 rounded-full border border-gold-200">
                <AlertTriangle className="w-8 h-8 text-gold-600" />
              </div>
            </div>

            <h2 className="font-serif text-xl font-bold text-luxury-black uppercase tracking-wider mb-3">
              {fallbackTitle || 'Algo deu errado'}
            </h2>
            
            <p className="text-xs text-luxury-gray leading-relaxed mb-6">
              {fallbackMessage || 
                'Não foi possível renderizar o painel administrativo. Isso pode ter ocorrido devido a uma inconsistência de dados ou dados ausentes.'}
            </p>

            {error && (
              <div className="p-3 bg-stone-50 border border-stone-200 text-left rounded mb-6">
                <p className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest mb-1">
                  Detalhes Técnicos:
                </p>
                <div className="text-[10px] font-mono text-stone-600 max-h-24 overflow-y-auto break-words whitespace-pre-wrap">
                  {error.toString()}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-luxury-black text-white hover:bg-gold-500 hover:text-white transition-all text-xs font-sans font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border border-[#111]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Recarregar Painel
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-transparent text-luxury-black hover:bg-gold-50 border border-gold-200 transition-all text-xs font-sans font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}
