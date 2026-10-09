import { request } from './httpClient';

export const registrarVisitaRequest = ({ salaId, sala, pontos }) =>
  request('/registrarLocal', { method: 'POST', body: { salaId, sala, pontos }, auth: true });

export const listarVisitasRequest = () => request('/locais');
