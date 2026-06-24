'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const FEEDBACK_API_URL = 'https://api.feedback.caiorodrigocev.com.br/feedbacks';

const feedbackSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string().email('Informe um e-mail válido'),
  message: z
    .string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem muito longa'),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

export function FeedbackPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  async function onSubmit(data: FeedbackFormData) {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(body || `HTTP ${response.status}`);
      }

      setStatus('success');
      reset();
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 3000);
    } catch {
      setStatus('error');
      setErrorMessage(
        'Não foi possível enviar seu feedback. Tente novamente mais tarde.',
      );
    }
  }

  function handleClose() {
    setIsOpen(false);
    setStatus('idle');
    setErrorMessage('');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
        aria-label="Abrir formulário de feedback"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label="Fechar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2
              id="feedback-title"
              className="text-lg font-semibold text-slate-900"
            >
              Enviar feedback
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ajude-nos a melhorar a Calculadora Fiscal Brasil.
            </p>

            {status === 'success' ? (
              <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                Feedback enviado com sucesso! Obrigado pela contribuição.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="feedback-name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Nome
                  </label>
                  <input
                    id="feedback-name"
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="Seu nome"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="feedback-email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    E-mail
                  </label>
                  <input
                    id="feedback-email"
                    type="email"
                    {...register('email')}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="feedback-message"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mensagem
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={4}
                    {...register('message')}
                    className="mt-1 block w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="Conte o que você achou, sugira melhorias ou reporte um problema..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {status === 'error' && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
