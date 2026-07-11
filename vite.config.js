import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { submitWaitlistEntry } from './server/waitlist.js';

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = '';

    request.on('data', (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 100_000) {
        reject(new Error('Request body too large'));
        request.destroy();
      }
    });

    request.on('end', () => {
      try {
        resolve(JSON.parse(rawBody || '{}'));
      } catch (error) {
        reject(error);
      }
    });

    request.on('error', reject);
  });
}

function waitlistDevApi(mode) {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    name: 'vaga-waitlist-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/waitlist', async (request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.setHeader('Allow', 'POST');
          response.end(JSON.stringify({ error: 'Método não permitido.' }));
          return;
        }

        let body;
        try {
          body = await readJsonBody(request);
        } catch {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: 'Pedido inválido.' }));
          return;
        }

        const origin = request.headers.origin
          || `http://${request.headers.host || 'localhost:5173'}`;

        const result = await submitWaitlistEntry({
          email: body.email,
          name: body.name,
          waitlistKey: process.env.WAITLIST_KEY || env.WAITLIST_KEY,
          origin,
          userAgent: request.headers['user-agent'],
        });

        response.statusCode = result.status;
        response.end(JSON.stringify(result.body));
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react({ jsxRuntime: 'automatic' }),
    waitlistDevApi(mode),
  ],
}));
