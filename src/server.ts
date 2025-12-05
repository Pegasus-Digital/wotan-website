import dotenv from 'dotenv';
import next from 'next';
import nextBuild from 'next/dist/build';
import path from 'path';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import express from 'express';
import payload from 'payload';
import isSalesAuthenticated from './_middlewares/sales-auth';
import isAdminAuthenticated from './_middlewares/admin-auth';

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for cookies
app.use(cookieParser());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (reason instanceof Error) {
    console.error('Error message:', reason.message);
    console.error('Error stack:', reason.stack);
  } else if (reason !== null && reason !== undefined) {
    console.error('Rejection reason (non-Error):', String(reason));
  } else {
    console.error('Rejection reason is null or undefined');
  }
});

const start = async (): Promise<void> => {
  await payload.init({
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
    secret: process.env.PAYLOAD_SECRET || '',
  });

  const dashboardMiddleware = (req, res, next) => {
    if (req.path !== '/login' && !req.headers['next-action']) {
      isAdminAuthenticated(req)
        .then((loggedIn) => {
          if (!loggedIn) {
            res.clearCookie('payload-token');
            const redirectUrl = `/painel/login?error=${encodeURIComponent(
              'Você deve estar logado para acessar o painel de Administrador'
            )}&redirect=${encodeURIComponent(req.originalUrl)}`;
            res.redirect(redirectUrl);
          } else {
            next();
          }
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : error ? String(error) : 'Unknown error';
          payload.logger.error({ err: errorMessage }, 'Error in admin authentication middleware');
          res.clearCookie('payload-token');
          const redirectUrl = `/painel/login?error=${encodeURIComponent(
            'Erro ao verificar autenticação'
          )}&redirect=${encodeURIComponent(req.originalUrl)}`;
          res.redirect(redirectUrl);
        });
    } else {
      next();
    }
  };

  const salesMiddleware = (req, res, next) => {
    if (req.path !== '/login' && !req.headers['next-action']) {
      isSalesAuthenticated(req)
        .then((loggedIn) => {
          if (!loggedIn) {
            res.clearCookie('payload-token');
            const redirectUrl = `/sistema/login?error=${encodeURIComponent(
              'Você deve estar logado para acessar o Sistema'
            )}&redirect=${encodeURIComponent(req.originalUrl)}`;
            res.redirect(redirectUrl);
          } else {
            next();
          }
        })
        .catch((error) => {
          const errorMessage = error instanceof Error ? error.message : error ? String(error) : 'Unknown error';
          payload.logger.error({ err: errorMessage }, 'Error in sales authentication middleware');
          res.clearCookie('payload-token');
          const redirectUrl = `/sistema/login?error=${encodeURIComponent(
            'Erro ao verificar autenticação'
          )}&redirect=${encodeURIComponent(req.originalUrl)}`;
          res.redirect(redirectUrl);
        });
    } else {
      next();
    }
  };

  if (process.env.NODE_ENV === 'production') {
    app.use('/painel', dashboardMiddleware);
    app.use('/sistema', salesMiddleware);
  }

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`);
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'));
      process.exit();
    });

    return;
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
  });

  const nextHandler = nextApp.getRequestHandler();

  app.all('*', (req, res) => nextHandler(req, res));

  nextApp
    .prepare()
    .then(() => {
      payload.logger.info('Starting Next.js...');

      app.listen(PORT, async () => {
        payload.logger.info(
          `Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`
        );
      });
    })
    .catch((err) => {
      const errorMessage = err instanceof Error ? err.message : err ? String(err) : 'Unknown error';
      payload.logger.error({ err: errorMessage }, 'Error starting Next.js');
    });
};

void start();
