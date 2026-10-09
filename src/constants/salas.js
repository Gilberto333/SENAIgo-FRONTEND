// Catálogo das áreas visitáveis. O `salaId` precisa bater com o que está no QR Code.
export const SALAS = [
  { salaId: 1, sala: 'Robótica', pontos: 5, icone: 'bot', descricao: 'Laboratório de Automação e Braços Robóticos.' },
  { salaId: 2, sala: 'Refrigeração', pontos: 10, icone: 'snowflake', descricao: 'Oficina Prática de Sistemas Térmicos e Climatização.' },
];

export const getSalaById = (salaId) => SALAS.find((s) => s.salaId === Number(salaId)) || null;
