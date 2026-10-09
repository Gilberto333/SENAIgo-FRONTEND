import { request } from './httpClient';

export const loginRequest = ({ email, senha }) =>
  request('/auth/login', { method: 'POST', body: { email, senha } });

export const cadastrarRequest = ({ cpf, nome, email, senha }) =>
  request('/cadastrarUsuario', { method: 'POST', body: { cpf, nome, email, senha } });
