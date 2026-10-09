import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { env } from '../../config/env';
import Logo from '../Logo/Logo';
import { ShoppingBag, LogOut, MapPin, Trophy, User } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
  const { user, visitedRooms, totalPoints, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };
  const totalSalasDisponiveis = env.totalAreas;
  const salasVisitadasCount = visitedRooms.length;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}><Link to="/home"><Logo size="small" /></Link></div>
        <div className={styles.centerSection}>
          <div className={styles.greetingBox}><User className={styles.userIcon} size={18} /><span>Olá, <strong>{user?.nome || 'Aluno'}</strong></span></div>
          <div className={styles.badgeVisitas}><MapPin size={16} className={styles.badgeIcon} /><span><strong>{salasVisitadasCount}</strong> / {totalSalasDisponiveis} áreas visitadas</span></div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.pointsPill}><Trophy size={16} className={styles.trophyIcon} /><span><strong>{totalPoints}</strong> pts</span></div>
          <nav className={styles.navLinks}>
            <Link to="/loja" className={`${styles.navBtn} ${location.pathname === '/loja' ? styles.active : ''}`}><ShoppingBag size={18} /><span>Loja</span></Link>
            <button onClick={handleLogout} className={styles.logoutBtn} title="Sair"><LogOut size={18} /></button>
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Header;