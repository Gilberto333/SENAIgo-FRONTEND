import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Tutorial from '../pages/Tutorial/Tutorial';
import Cadastro from '../pages/Cadastro/Cadastro';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import Loja from '../pages/Loja/Loja';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Tutorial />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/loja" element={<PrivateRoute><Loja /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
export default AppRoutes;
