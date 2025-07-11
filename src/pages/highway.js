import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/highway.module.css';

const Highway = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  
  useEffect(() => {
    const initialHeight = window.innerHeight;
    const vh = initialHeight * 0.01;
    document.documentElement.style.setProperty('--fixed-vh', `${vh}px`);
  }, []);
  

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    setScrollY(window.scrollY);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progress = Math.min(scrollY / 5000, 1);

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
    { id: 1, side: 'left', initialY: 20, xOffset: -120, image: '/images/sign1.webp' },
    { id: 2, side: 'right', initialY: 40, xOffset: 170, image: '/images/sign2.webp' },
    { id: 3, side: 'left', initialY: -80, xOffset: -50, image: '/images/sign3.webp' },
    { id: 4, side: 'right', initialY: -120, xOffset: 10, image: '/images/sign4.webp' },
    { id: 5, side: 'left', initialY: -180, xOffset: 100, image: '/images/sign5.webp' },
    { id: 6, side: 'right', initialY: -220, xOffset: -170, image: '/images/sign6.webp' },
    { id: 7, side: 'left', initialY: -260, xOffset: 250, image: '/images/sign7.webp' },
    { id: 8, side: 'right', initialY: -300, xOffset: -230, image: '/images/sign8.webp' },
    { id: 9, side: 'left', initialY: -340, xOffset: 410, image: '/images/sign9.webp' },
    { id: 10, side: 'right', initialY: -380, xOffset: -320, image: '/images/sign10.webp' }

  ];

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.viewport}>
      <img src="/images/bg.webp" alt="bg" className={styles.bg} />
          <img src='/images/img19.webp' alt="car" className={styles.car} />
          <img src="/images/img1.webp" alt="img1" className={styles.img1} />
          <img src="/images/img2.webp" alt="img2" className={styles.img2} />
          <img src="/images/img3.webp" alt="img3" className={styles.img3} />
          <img src="/images/img4.webp" alt="img4" className={styles.img4} />
          <img src="/images/img5.webp" alt="img5" className={styles.img5} />
          {/* <img src="/images/img6.webp" alt="img6" className={styles.img6} /> */}
          {/* <img src="/images/img7.webp" alt="img7" className={styles.img7} /> */}
          <img src="/images/img8.webp" alt="img8" className={styles.img8} />
          <img src="/images/img9.webp" alt="img9" className={styles.img9} />
          <img src="/images/img10.webp" alt="img10" className={styles.img10} />
          <img src="/images/img11.webp" alt="img11" className={styles.img11} />
          {/* <img src="/images/img12.webp" alt="img12" className={styles.img12} />
          <img src="/images/img13.webp" alt="img13" className={styles.img13} />
          <img src="/images/img14.webp" alt="img14" className={styles.img14} />
          <img src="/images/img15.webp" alt="img15" className={styles.img15} />
          <img src="/images/img16.webp" alt="img16" className={styles.img16} /> */}
          {/* <img src="/images/img17.webp" alt="img17" className={styles.img17} />
          <img src="/images/img18.webp" alt="img18" className={styles.img18} />
          <img src="/images/img19.webp" alt="img19" className={styles.img19} /> */}
          <img src="/images/img20.webp" alt="img20" className={styles.img20} />
          <img src="/images/img21.webp" alt="img21" className={styles.img21} />
          <img src="/images/img22.webp" alt="img22" className={styles.img22} />
          <img src="/images/img23.webp" alt="img23" className={styles.img23} />
          <img src="/images/img24.webp" alt="img24" className={styles.img24} />
          <img src="/images/img25.webp" alt="img25" className={styles.img25} />
          <img src="/images/img26.webp" alt="img26" className={styles.img26} />

        {signs.map((sign) => (
          <div
            key={sign.id}
            className={styles.sign}
            style={getSignStyle(sign.initialY, sign.side, sign.xOffset)}
          >
            <img src={sign.image} alt={`Sign ${sign.id}`} className={styles.signBoard} />
          </div>
        ))}
        <img src='/images/img17.webp' alt="road" className={styles.road} />
        <img src='/images/img18.webp' alt="road" className={styles.road} />
        <img src = '/images/filter.webp' alt="filter" className={styles.bgFilter} />
        <img src='/images/setlist.png' alt="road" className={styles.setlist} onClick={() => navigate('/setlist')} />

      </div>
    </div>
  );
};

export default Highway;
