import React, { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { loginRequest, cadastrarRequest } from '../services/authService';
import { registrarVisitaRequest, listarVisitasRequest } from '../services/visitasService';
import { ApiError } from '../services/httpClient';
import {
  getToken, setToken, removeToken,
  getStoredUser, setStoredUser, removeStoredUser,
} from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken);
  const [user, setUser] = useState(getStoredUser);
  const [visits, setVisits] = useState([]);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const loadIdRef = useRef(0);

  // A API devolve as visitas de todos os alunos; aqui ficam só as do usuário logado.
  const carregarVisitas = useCallback(async (userId) => {
    const loadId = ++loadIdRef.current;
    setSyncing(true);
    setSyncError('');
    try {
      const todas = await listarVisitasRequest();
      if (loadId !== loadIdRef.current) return;
      setVisits(Array.isArray(todas) ? todas.filter((v) => v.id === userId) : []);
    } catch (err) {
      if (loadId === loadIdRef.current) setSyncError(err.message);
    } finally {
      if (loadId === loadIdRef.current) setSyncing(false);
    }
  }, []);

  const isAuthenticated = Boolean(token && user?.id != null);

  useEffect(() => {
    if (isAuthenticated) carregarVisitas(user.id);
  }, [isAuthenticated, user?.id, carregarVisitas]);

  const cadastrar = useCallback((dados) => cadastrarRequest(dados), []);

  const login = useCallback(async (email, senha) => {
    const data = await loginRequest({ email, senha });
    const { token: novoToken, usuarioLogin } = data || {};
    if (!novoToken || !usuarioLogin) throw new ApiError('Resposta inesperada do servidor.');

    const usuario = { id: usuarioLogin.id, nome: usuarioLogin.nome, email: usuarioLogin.email };
    setToken(novoToken);
    setStoredUser(usuario);
    setTokenState(novoToken);
    setUser(usuario);
  }, []);

  const logout = useCallback(() => {
    loadIdRef.current += 1;
    removeToken();
    removeStoredUser();
    setTokenState(null);
    setUser(null);
    setVisits([]);
    setSyncError('');
    setSyncing(false);
  }, []);

  const visitedRooms = useMemo(() => [...new Set(visits.map((v) => v.salaId))], [visits]);
  const totalPoints = useMemo(
    () => visits.reduce((total, v) => total + (Number(v.pontuacao) || 0), 0),
    [visits],
  );

  const registrarVisita = useCallback(async ({ salaId, sala, pontos }) => {
    if (visitedRooms.includes(salaId)) {
      throw new ApiError('Você já visitou esta área.', { status: 409 });
    }
    try {
      const res = await registrarVisitaRequest({ salaId, sala, pontos });
      const visita = res?.localDeVisita ?? { id: user.id, nome: user.nome, salaId, sala, pontuacao: pontos };
      setVisits((prev) => [...prev, visita]);
      return visita;
    } catch (err) {
      if (err.status === 401) {
        logout();
        throw new ApiError('Sua sessão expirou. Faça login novamente.', { status: 401 });
      }
      if (err.status === 409) carregarVisitas(user.id);
      throw err;
    }
  }, [visitedRooms, user, logout, carregarVisitas]);

  const value = useMemo(() => ({
    user, token, isAuthenticated, visitedRooms, totalPoints, syncing, syncError,
    cadastrar, login, logout, registrarVisita,
  }), [user, token, isAuthenticated, visitedRooms, totalPoints, syncing, syncError,
    cadastrar, login, logout, registrarVisita]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
