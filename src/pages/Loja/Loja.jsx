import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { Gift, Trophy, Sparkles } from 'lucide-react';
import styles from './Loja.module.css';

const Loja = () => {
  const { totalPoints } = useAuth();

  const produtos = [
    { id: 1, nome: 'Caneca SENAI', pontos: 15, img: '☕' },
    { id: 2, nome: 'Camisa SENAI', pontos: 30, img: '👕' },
    { id: 3, nome: 'Chaveiro Exclusivo', pontos: 10, img: '🔑' },
    { id: 4, nome: 'Garrafa Personalizada', pontos: 25, img: '🧴' },
    { id: 5, nome: 'Mochila Tech SENAI', pontos: 50, img: '🎒' },
    { id: 6, nome: 'Fone Bluetooth', pontos: 80, img: '🎧' },
  ];

  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.bannerLoja}>
          <div className={styles.bannerInfo}>
            <div className={styles.tagLoja}><Sparkles size={16} /><span>Loja de Recompensas</span></div>
            <h2>Troque seus pontos por Brindes</h2>
            <p>Sua participação nas salas do SENAI garante brindes e prêmios exclusivos!</p>
          </div>
          <div className={styles.saldoPill}>
            <Trophy size={20} />
            <div><small>Seu Saldo</small><br /><strong>{totalPoints} Pontos</strong></div>
          </div>
        </section>

        <section className={styles.productsGrid}>
          {produtos.map((item) => {
            const podeResgatar = totalPoints >= item.pontos;
            return (
              <Card key={item.id} className={styles.productCard}>
                <div className={styles.imagePlaceholder}><span className={styles.emojiImg}>{item.img}</span></div>
                <div className={styles.productInfo}>
                  <h4 className={styles.productName}>{item.nome}</h4>
                  <div className={styles.pointsCost}><Trophy size={16} /><span>{item.pontos} Pontos</span></div>
                </div>
                <div className={styles.cardFooter}>
                  <Button variant={podeResgatar ? 'primary' : 'outline'} fullWidth disabled={!podeResgatar} icon={Gift}>
                    {podeResgatar ? 'Resgatar' : 'Pontos Insuficientes'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
};
export default Loja;