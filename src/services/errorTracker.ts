/**
 * TFKS Error Monitoring & Telemetry Tracker (D3)
 * Provides centralized error logging, breadcrumb capturing, and integration hooks
 */

export interface ErrorBreadcrumb {
  timestamp: number;
  category: 'ui' | 'network' | 'audit' | 'acl' | 'system';
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}

export interface CapturedError {
  id: string;
  message: string;
  stack?: string;
  timestamp: number;
  componentStack?: string;
  context?: Record<string, unknown>;
  breadcrumbs: ErrorBreadcrumb[];
}

class ErrorTrackerService {
  private static instance: ErrorTrackerService;
  private breadcrumbs: ErrorBreadcrumb[] = [];
  private capturedErrors: CapturedError[] = [];
  private maxBreadcrumbs = 30;

  public static getInstance(): ErrorTrackerService {
    if (!ErrorTrackerService.instance) {
      ErrorTrackerService.instance = new ErrorTrackerService();
    }
    return ErrorTrackerService.instance;
  }

  public addBreadcrumb(crumb: Omit<ErrorBreadcrumb, 'timestamp'>): void {
    const entry: ErrorBreadcrumb = {
      ...crumb,
      timestamp: Date.now(),
    };
    this.breadcrumbs.push(entry);
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  public captureException(error: Error | unknown, context?: Record<string, unknown>): string {
    const errObj = error instanceof Error ? error : new Error(String(error));
    const errorId = `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const record: CapturedError = {
      id: errorId,
      message: errObj.message,
      stack: errObj.stack,
      timestamp: Date.now(),
      context,
      breadcrumbs: [...this.breadcrumbs],
    };

    this.capturedErrors.unshift(record);
    if (this.capturedErrors.length > 50) {
      this.capturedErrors.pop();
    }

    // Console warning with breadcrumb history in development
    console.error(`[TFKS-ERROR-TRACKER ${errorId}]`, errObj.message, { context, breadcrumbs: this.breadcrumbs });
    return errorId;
  }

  public getErrors(): CapturedError[] {
    return [...this.capturedErrors];
  }

  public clearErrors(): void {
    this.capturedErrors = [];
    this.breadcrumbs = [];
  }
}

export const errorTracker = ErrorTrackerService.getInstance();
