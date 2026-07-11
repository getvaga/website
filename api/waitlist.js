import { submitWaitlistEntry } from '../server/waitlist.js';

function getRequestOrigin(request) {
  const forwardedProto = request.headers['x-forwarded-proto'];
  const forwardedHost = request.headers['x-forwarded-host'];
  const host = forwardedHost || request.headers.host;
  const proto = forwardedProto || 'https';

  return request.headers.origin || (host ? `${proto}://${host}` : '');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Método não permitido.' });
  }

  let body = request.body || {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      return response.status(400).json({ error: 'Pedido inválido.' });
    }
  }

  const result = await submitWaitlistEntry({
    email: body.email,
    name: body.name,
    waitlistKey: process.env.WAITLIST_KEY,
    origin: getRequestOrigin(request),
    userAgent: request.headers['user-agent'],
  });

  return response.status(result.status).json(result.body);
}
