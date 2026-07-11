function normalizeOrigin(value) {
  const origin = String(value || '').trim();
  if (!origin) return '';

  try {
    return new URL(origin).origin;
  } catch {
    return '';
  }
}

export async function submitWaitlistEntry({
  email,
  name,
  waitlistKey,
  origin,
  userAgent,
}) {
  const normalizedEmail = String(email || '').trim();
  const normalizedName = String(name || '').trim();
  const normalizedOrigin = normalizeOrigin(origin);

  if (!waitlistKey) {
    return {
      status: 500,
      body: { error: 'A lista de espera ainda não está configurada.' },
    };
  }

  if (!normalizedEmail) {
    return {
      status: 400,
      body: { error: 'Indica o teu email.' },
    };
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json, text/html;q=0.9, */*;q=0.8',
  };

  // Waitlister may validate the submitting domain. Forward the browser origin
  // instead of making the request look like an origin-less server submission.
  if (normalizedOrigin) {
    headers.Origin = normalizedOrigin;
    headers.Referer = `${normalizedOrigin}/`;
  }

  if (userAgent) {
    headers['User-Agent'] = String(userAgent);
  }

  try {
    const upstream = await fetch(`https://waitlister.me/s/${waitlistKey}`, {
      method: 'POST',
      headers,
      body: new URLSearchParams({
        email: normalizedEmail,
        name: normalizedName,
      }),
      // The form endpoint can answer with a redirect to a thank-you page.
      // A redirect means the signup was accepted, so do not follow it server-side.
      redirect: 'manual',
    });

    if (upstream.status >= 200 && upstream.status < 400) {
      return { status: 200, body: { ok: true } };
    }

    const upstreamBody = await upstream.text().catch(() => '');

    console.error('[vaga-waitlist] Waitlister rejected the submission', {
      status: upstream.status,
      statusText: upstream.statusText,
      origin: normalizedOrigin || '(missing)',
      body: upstreamBody.slice(0, 500),
    });

    if (upstream.status === 401 || upstream.status === 403) {
      return {
        status: 502,
        body: {
          error: 'O domínio não está autorizado no Waitlister. Adiciona localhost e o domínio da Vercel à whitelist.',
        },
      };
    }

    if (upstream.status === 404) {
      return {
        status: 502,
        body: {
          error: 'A chave da lista de espera não foi reconhecida. Confirma WAITLIST_KEY.',
        },
      };
    }

    return {
      status: 502,
      body: {
        error: `O Waitlister recusou a inscrição (${upstream.status}). Consulta o terminal para veres a resposta completa.`,
      },
    };
  } catch (error) {
    console.error('[vaga-waitlist] Waitlister request failed', error);

    return {
      status: 502,
      body: {
        error: 'Não foi possível contactar o serviço da lista de espera.',
      },
    };
  }
}
