'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <div className="max-w-md text-center">
            <AlertTriangle className="mx-auto size-12 text-amber-500" />
            <h2 className="mt-4 text-lg font-semibold">
              Terjadi Kesalahan
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Aplikasi mengalami kesalahan yang tidak terduga.
            </p>
            {this.state.error && (
              <pre className="mt-4 max-h-32 overflow-auto rounded bg-muted p-3 text-left text-xs">
                {this.state.error.message}
              </pre>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={this.handleReset}>
                <RotateCcw className="mr-2 size-4" />
                Coba Lagi
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Muat Ulang
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
