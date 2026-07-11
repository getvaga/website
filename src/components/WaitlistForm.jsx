import React from 'react';
import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Não foi possível concluir a inscrição.');
      }

      setSuccess(true);
      setEmail('');
      setName('');
    } catch (submissionError) {
      setError(submissionError.message || 'Não foi possível entrar na lista. Tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="success-message" role="status">
        <b>Já estás dentro.</b>
        <span>Quando a Vaga abrir em Lisboa, vais saber primeiro.</span>
      </div>
    );
  }

  return (
    <form className="pilot-form" onSubmit={handleSubmit}>
      <div className="waitlist-fields">
        <label>
          <span>Nome</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="O teu nome"
            autoComplete="name"
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nome@email.pt"
            autoComplete="email"
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar na lista'}
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      <small>Sem spam. Só novidades sobre o piloto da Vaga.</small>
    </form>
  );
}
