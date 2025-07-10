import React, { useState, useEffect } from 'react';
import styles from '../styles/highway.module.css';

const Highway = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setScrollY(window.scrollY);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progress = Math.min(scrollY / 3000, 1);

  const getSignStyle = (initialY, side, xOffset) => {
    const xMoveAmount = 1200; // x축 이동 거리(px)
    const yMoveAmount = 800; // y축 이동 거리(px)
  
    const yMove = initialY + progress * yMoveAmount;  // y는 양수 방향 (아래로)
    const xMove = side === 'left' 
      ? xOffset - progress * xMoveAmount  // 왼쪽은 x 음수 방향 (왼쪽으로)
      : xOffset + progress * xMoveAmount; // 오른쪽은 x 양수 방향 (오른쪽으로)
  
    const scale = Math.max(0.3, Math.min(2, 1 + progress * 1.5));
    const opacity = yMove > -100 ? Math.max(0, Math.min(1, 1 - yMove / 600)) : 0;
  
    return {
      transform: `translateX(${xMove}px) translateY(${yMove}px) scale(${scale})`,
      opacity,
      zIndex: Math.floor(-yMove + 100),
    };
  };
  
  const signs = [
    { id: 1, side: 'left', initialY: -70, xOffset: -60, image: '/images/sign1.webp' },
    { id: 2, side: 'right', initialY: -20, xOffset: 130, image: '/images/sign2.webp' },
    { id: 3, side: 'left', initialY: -200, xOffset: 200, image: '/images/sign3.webp' },
    { id: 4, side: 'right', initialY: -150, xOffset: -20, image: '/images/sign4.webp' },
    { id: 5, side: 'left', initialY: -400, xOffset: 50, image: '/images/sign5.webp' }
  ];

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.viewport}>
      <img src="/images/bg.webp" alt="bg" className={styles.bg} />
        
          <img src='/images/img17.webp' alt="road" className={styles.road} />
          <img src='/images/img18.webp' alt="road" className={styles.road} />
          <img src='/images/img19.webp' alt="car" className={styles.car} />
     

        {signs.map((sign) => (
          <div
            key={sign.id}
            className={styles.sign}
            style={getSignStyle(sign.initialY, sign.side, sign.xOffset)}
          >
            <img src={sign.image} alt={`Sign ${sign.id}`} className={styles.signBoard} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Highway;
