import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/highway.module.css';

const SCROLL_MAX = 5000;
const Y_MOVE_AMOUNT = 800;
const X_MOVE_AMOUNT = 1200;

const signPopupMap = {
  sign1: ['main3_1', 'main3_2', 'main3_3'],
  sign2: ['main4_1', 'main4_2', 'main4_3'],
  sign3: ['main1_1', 'main1_2', 'main1_3'],
  sign4: ['main2_1', 'main2_2', 'main2_3'],
  sign5: ['free1_1'],
  sign6: ['free6_1', 'free6_2'],
  sign7: ['free2_1', 'free2_2'],
  sign8: ['free5_1', 'free5_2'],
  sign9: ['free4_1', 'free4_2', 'free4_3'],
  sign10: ['free3_1', 'free3_2'],
};

const Highway = () => {
  const navigate = useNavigate();
  const progressRef = useRef(0);
  const [, forceRender] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupImages, setPopupImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleBack = () => navigate(-1);

  const openPopupBySignId = useCallback((signId) => {
    const images = signPopupMap[signId] || [];
    if (images.length === 0) return;
    setPopupImages(images);
    setCurrentIndex(0);
    setPopupVisible(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupVisible(false);
    setPopupImages([]);
    setCurrentIndex(0);
  }, []);

  const handlePopupClick = useCallback((e) => {
    if (e.target.id === 'popupOverlay') closePopup();
  }, [closePopup]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + popupImages.length) % popupImages.length);
  }, [popupImages]);

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % popupImages.length);
  }, [popupImages]);

  const [selectedSign, setSelectedSign] = useState(null);
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--fixed-vh', `${vh}px`);
  }, []);

  useEffect(() => {
    let animationFrameId = null;
    const onScroll = () => {
      const scrollY = window.scrollY;
      const newProgress = Math.min(scrollY / SCROLL_MAX, 1);
      if (Math.abs(newProgress - progressRef.current) > 0.01) {
        progressRef.current = newProgress;
        forceRender((n) => n + 1);
        setRenderTrigger((n) => n + 1);
      }
    };
    const handleScroll = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          onScroll();
          animationFrameId = null;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const signs = useMemo(() => [
    { id: 1, side: 'left', initialY: 70, xOffset: -140, image: '/images/sign1.webp' },
    { id: 2, side: 'right', initialY: 30, xOffset: 100, image: '/images/sign2.webp' },
    { id: 3, side: 'left', initialY: -30, xOffset: -40, image: '/images/sign3.webp' },
    { id: 4, side: 'right', initialY: -80, xOffset: -10, image: '/images/sign4.webp' },
    { id: 5, side: 'left', initialY: -120, xOffset: 100, image: '/images/sign5.webp' },
    { id: 6, side: 'right', initialY: -160, xOffset: -160, image: '/images/sign6.webp' },
    { id: 7, side: 'left', initialY: -200, xOffset: 240, image: '/images/sign7.webp' },
    { id: 8, side: 'right', initialY: -250, xOffset: -230, image: '/images/sign8.webp' },
    { id: 9, side: 'left', initialY: -290, xOffset: 410, image: '/images/sign9.webp' },
    { id: 10, side: 'right', initialY: -349, xOffset: -350, image: '/images/sign10.webp' },
  ], []);

  const calcYMove = useCallback((initialY, progress) => initialY + progress * Y_MOVE_AMOUNT, []);

  const isVisible = useCallback((yMove) => {
    const vh = window.innerHeight;
    return yMove > -vh * 0.3 && yMove < vh * 1.3;
  }, []);

  const visibleSigns = useMemo(() => {
    return signs.filter(sign => {
      const yMove = calcYMove(sign.initialY, progressRef.current);
      const opacity = yMove > -31 ? Math.max(0, Math.min(1, 1 - yMove / 600)) : 0;
      return isVisible(yMove) && opacity > 0;
    });
  }, [signs, calcYMove, isVisible, renderTrigger]);

  const signStyles = useMemo(() => {
    return visibleSigns.reduce((acc, sign) => {
      const yMove = calcYMove(sign.initialY, progressRef.current);
      const xMove = sign.side === 'left'
        ? sign.xOffset - progressRef.current * X_MOVE_AMOUNT
        : sign.xOffset + progressRef.current * X_MOVE_AMOUNT;
      const scale = Math.max(0.3, Math.min(2, 1 + progressRef.current * 1.5));
      const opacity = yMove > -31 ? Math.max(0, Math.min(1, 1 - yMove / 600)) : 0;
      acc[sign.id] = {
        transform: `translate3d(${xMove}px, ${yMove}px, 0) scale(${scale})`,
        opacity,
        zIndex: sign.side === 'left' ? Math.floor(-sign.initialY + 1000) : Math.floor(-sign.initialY + 1500),
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        willChange: opacity > 0 ? 'transform, opacity' : 'auto',
      };
      return acc;
    }, {});
  }, [visibleSigns, calcYMove]);

  return (
    <div className={styles.scrollContainer}>
      <h1 className={styles.title}>Scroll and click signs!</h1>
      <img src="/images/back.webp" alt="back" className={styles.backButton} onClick={handleBack} />

      <div className={styles.viewport}>
        <img src="/images/bg.webp" alt="bg" className={styles.bg} loading="lazy" />
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
<img src="/images/img17.webp" alt="road" className={styles.road} loading="lazy" />
<img src="/images/img18.webp" alt="road2" className={styles.road} loading="lazy" />
<img src="/images/filter.webp" alt="filter" className={styles.bgFilter} loading="lazy" />
<img src="/images/setlist.webp" alt="setlist" className={styles.setlist} onClick={() => navigate('/setlist')} />

        {visibleSigns.map(sign => {
          const style = signStyles[sign.id];
          if (!style || style.opacity === 0) return null;
          return (
            <div
              key={sign.id}
              className={styles.sign}
              style={style}
              onClick={() => openPopupBySignId(`sign${sign.id}`)}
            >
              <img src={sign.image} alt={`Sign ${sign.id}`} className={styles.signBoard} loading="lazy" />
            </div>
          );
        })}
      </div>

      {popupVisible && popupImages.length > 0 && (
        <div id="popupOverlay" className={styles.popupOverlay} onClick={handlePopupClick}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={closePopup}>×</button>
            <img
              src={`/images/${popupImages[currentIndex]}.webp`}
              alt={`popup-${currentIndex}`}
              className={styles.popupImage}
              loading="lazy"
            />
            {popupImages.length > 1 && (
              <>
                <button className={styles.prevButton} onClick={showPrev}>‹</button>
                <button className={styles.nextButton} onClick={showNext}>›</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Highway;
