import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/highway.module.css';

const Highway = () => {
  const navigate = useNavigate();
  const scrollYRef = useRef(0);
  const [, forceUpdate] = useState(false);
  const [selectedSign, setSelectedSign] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--fixed-vh', `${vh}px`);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          forceUpdate((v) => !v); // 최소 리렌더링
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progress = Math.min(scrollYRef.current / 5000, 1);

  const getSignStyle = (initialY, side, xOffset) => {
    const xMoveAmount = 1200;
    const yMoveAmount = 800;

    const yMove = initialY + progress * yMoveAmount;
    const xMove = side === 'left'
      ? xOffset - progress * xMoveAmount
      : xOffset + progress * xMoveAmount;

    const scale = Math.max(0.3, Math.min(2, 1 + progress * 1.5));
    const opacity = yMove > -31 ? Math.max(0, Math.min(1, 1 - yMove / 600)) : 0;

    return {
      transform: `translateX(${xMove}px) translateY(${yMove}px) scale(${scale})`,
      opacity,
      zIndex: Math.floor(-yMove + 100),
      pointerEvents: opacity === 0 ? 'none' : 'auto',
    };
  };

  const isVisible = (yMove) =>
    yMove > -window.innerHeight * 0.3 && yMove < window.innerHeight * 1.3;

  const signs = [
    { id: 1, side: 'left', initialY: 70, xOffset: -130, image: '/images/sign1.webp', popupImages: ['/images/main3_1.png', '/images/main3_2.png', '/images/main3_3.png'] },
    { id: 2, side: 'right', initialY: 30, xOffset: 100, image: '/images/sign2.webp', popupImages: ['/images/main4_1.png', '/images/main4_2.png', '/images/main4_3.png'] },
    { id: 3, side: 'left', initialY: -30, xOffset: -40, image: '/images/sign3.webp', popupImages: ['/images/main1_1.png', '/images/main1_2.png', '/images/main1_3.png'] },
    { id: 4, side: 'right', initialY: -80, xOffset: -10, image: '/images/sign4.webp', popupImages: ['/images/main2_1.png', '/images/main2_2.png', '/images/main2_3.png'] },
    { id: 5, side: 'left', initialY: -100, xOffset: 60, image: '/images/sign5.webp' },
    { id: 6, side: 'right', initialY: -130, xOffset: -120, image: '/images/sign6.webp' },
    { id: 7, side: 'left', initialY: -180, xOffset: 200, image: '/images/sign7.webp' },
    { id: 8, side: 'right', initialY: -240, xOffset: -230, image: '/images/sign8.webp' },
    { id: 9, side: 'left', initialY: -280, xOffset: 400, image: '/images/sign9.webp' },
    { id: 10, side: 'right', initialY: -340, xOffset: -340, image: '/images/sign10.webp' }
  ];

  const handleSignClick = (sign) => {
    setSelectedSign(sign);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedSign(null);
  };

  const handlePopupBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.viewport}>
        <img src="/images/bg.webp" alt="bg" className={styles.bg} loading="lazy" />
        <img src="/images/img19.webp" alt="car" className={styles.car} loading="lazy" />
        <img src="/images/img1.webp" alt="img1" className={styles.img1} loading="lazy" />
        <img src="/images/img2.webp" alt="img2" className={styles.img2} loading="lazy" />
        <img src="/images/img3.webp" alt="img3" className={styles.img3} loading="lazy" />
        <img src="/images/img4.webp" alt="img4" className={styles.img4} loading="lazy" />
        <img src="/images/img5.webp" alt="img5" className={styles.img5} loading="lazy" />
        <img src="/images/img8.webp" alt="img8" className={styles.img8} loading="lazy" />
        <img src="/images/img9.webp" alt="img9" className={styles.img9} loading="lazy" />
        <img src="/images/img10.webp" alt="img10" className={styles.img10} loading="lazy" />
        <img src="/images/img11.webp" alt="img11" className={styles.img11} loading="lazy" />
        <img src="/images/img20.webp" alt="img20" className={styles.img20} loading="lazy" />
        <img src="/images/img21.webp" alt="img21" className={styles.img21} loading="lazy" />
        <img src="/images/img22.webp" alt="img22" className={styles.img22} loading="lazy" />
        <img src="/images/img23.webp" alt="img23" className={styles.img23} loading="lazy" />
        <img src="/images/img24.webp" alt="img24" className={styles.img24} loading="lazy" />
        <img src="/images/img25.webp" alt="img25" className={styles.img25} loading="lazy" />
        <img src="/images/img26.webp" alt="img26" className={styles.img26} loading="lazy" />

        {signs.map((sign) => {
          const yMove = sign.initialY + progress * 800;
          if (!isVisible(yMove)) return null;

          return (
            <div
              key={sign.id}
              className={styles.sign}
              style={getSignStyle(sign.initialY, sign.side, sign.xOffset)}
              onClick={() => handleSignClick(sign)}
            >
              <img src={sign.image} alt={`Sign ${sign.id}`} className={styles.signBoard} loading="lazy" />
              <div className={styles.clickArea}></div>
            </div>
          );
        })}

        <img src="/images/img17.webp" alt="road" className={styles.road} loading="lazy" />
        <img src="/images/img18.webp" alt="road" className={styles.road} loading="lazy" />
        <img src="/images/filter.webp" alt="filter" className={styles.bgFilter} loading="lazy" />
        <img src="/images/setlist.png" alt="setlist" className={styles.setlist} onClick={() => navigate('/setlist')} />
      </div>

      {popupVisible && selectedSign && (
        <div className={styles.popupOverlay} onClick={handlePopupBackgroundClick}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={closePopup}>×</button>
            <div className={styles.popupImages}>
              {selectedSign.popupImages?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Popup ${selectedSign.id}-${index + 1}`}
                  className={styles.popupImage}
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Highway;
