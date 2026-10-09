import { env } from '../config/env';
import { getToken } from '../utils/storage';

export class ApiError extends Error {
  constructor(message, { status = 0 } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const FALLBACK_MESSAGES = {
  400: 'Dados inválidos. Revise as informações e tente novamente.',
  401: 'Sua sessão expirou. Faça login novamente.',
  404: 'Recurso não encontrado.',
  415: 'Formato de requisição inválido.',
  500: 'Erro interno no servidor. Tente novamente em instantes.',
};

const extractMessage = (data, status) => {
  if (data?.erro) return data.erro;
  if (Array.isArray(data?.erros) && data.erros.length) return data.erros.join(' ');
  return FALLBACK_MESSAGES[status] || `Erro inesperado (${status}).`;
};

export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.apiTimeoutMs);

  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) throw new ApiError(extractMessage(data, response.status), { status: response.status });
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      throw new ApiError('O servidor demorou para responder. Tente novamente.');
    }
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.');
  } finally {
    clearTimeout(timer);
  }
}
