import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BACKEND_NOT_CONFIGURED = 'BACKEND_NOT_CONFIGURED';
const BACKEND_NOT_READY_MESSAGE =
  'Bu işlem kapalı: doğrulanmış kimlik doğrulama, kalıcı veri deposu ve işlemsel kontroller henüz yapılandırılmadı.';

type CreateAppOptions = {
  /** Disable Vite/static middleware for isolated API tests. */
  serveFrontend?: boolean;
};

function unavailable(res: express.Response, feature: string) {
  return res.status(503).json({
    status: 'error',
    statusCode: 503,
    error: BACKEND_NOT_CONFIGURED,
    feature,
    message: BACKEND_NOT_READY_MESSAGE,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Creates the Express application. Business-write APIs intentionally fail closed
 * until server-side identity verification, durable storage, and transaction
 * semantics are implemented. A successful-looking hash is not proof that an
 * order, cash transfer, or audit record was persisted or verified.
 */
export async function createApp(options: CreateAppOptions = {}): Promise<express.Express> {
  const app = express();
  const serveFrontend = options.serveFrontend ?? true;

  app.disable('x-powered-by');
  // Limit JSON request sizes to reduce accidental or abusive memory consumption.
  app.use(express.json({ limit: '256kb', strict: true }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'success',
      statusCode: 200,
      data: {
        status: 'healthy',
        service: 'MotoPilot TFKS Express API',
        uptimeSeconds: Math.round(process.uptime()),
        businessApiReady: false,
        persistenceConfigured: false,
        authenticationConfigured: false,
      },
      message: 'HTTP sunucusu çalışıyor; iş ve finans API uçları güvenli yapılandırma tamamlanana kadar kapalıdır.',
      timestamp: new Date().toISOString(),
    });
  });

  // Do not return mutable process memory as if it were canonical persisted state.
  app.get('/api/state', (_req, res) => unavailable(res, 'state-read'));
  app.post('/api/state/sync', (_req, res) => unavailable(res, 'state-sync'));

  // These endpoints previously returned success-shaped responses without saving
  // data, authenticating callers, or applying atomic database transactions.
  // Keep them closed until those guarantees are implemented and integration-tested.
  app.post('/api/orders', (_req, res) => unavailable(res, 'order-create'));
  app.post('/api/vaults/transfer', (_req, res) => unavailable(res, 'vault-transfer'));
  app.post('/api/audit/verify', (_req, res) => unavailable(res, 'audit-chain-verification'));

  if (serveFrontend) {
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath, { index: false }));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  } else {
    app.use('/api', (_req, res) => {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        error: 'NOT_FOUND',
        message: 'API endpoint bulunamadı.',
      });
    });
    app.use((_req, res) => res.status(404).send('Not found'));
  }

  // Return sanitized parser errors; never expose stack traces to clients.
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const details = error as { type?: string; status?: number; statusCode?: number };
    if (details?.type === 'entity.too.large' || details?.status === 413 || details?.statusCode === 413) {
      return res.status(413).json({
        status: 'error',
        statusCode: 413,
        error: 'PAYLOAD_TOO_LARGE',
        message: 'İstek gövdesi izin verilen boyutu aşıyor.',
      });
    }
    if (details?.type === 'entity.parse.failed' || error instanceof SyntaxError) {
      return res.status(400).json({
        status: 'error',
        statusCode: 400,
        error: 'INVALID_JSON',
        message: 'İstek gövdesi geçerli JSON olmalıdır.',
      });
    }
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      error: 'INVALID_REQUEST',
      message: 'İstek işlenemedi.',
    });
  });

  return app;
}

async function startServer() {
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT 1 ile 65535 arasında bir tamsayı olmalıdır.');
  }

  const app = await createApp();
  app.listen(port, host, () => {
    console.log(`[MotoPilot TFKS Server] HTTP sunucusu ${host}:${port} üzerinde başlatıldı.`);
    console.warn('[MotoPilot TFKS Server] İş/finans API uçları, gerçek auth + kalıcı veri + transaction katmanı eklenene kadar kapalıdır.');
  });
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  startServer().catch((error: unknown) => {
    // Server-side logs retain startup diagnostics; API responses remain sanitized.
    console.error('Sunucu başlatma hatası:', error);
    process.exitCode = 1;
  });
}
