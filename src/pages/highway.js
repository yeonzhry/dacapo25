import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/highway.module.css';

const SCROLL_MAX = 5000;
const Y_MOVE_AMOUNT = 800;
const X_MOVE_AMOUNT = 1200;

const Highway = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 또는 원하는 경로 예: navigate('/')
  };

  const progressRef = useRef(0);
  const [, forceRender] = useState(0);

  const [selectedSign, setSelectedSign] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

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
    { id: 1, side: 'left', initialY: 70, xOffset: -140, image: '/images/sign1.webp', popupImages: ['/images/main3_1.webp', '/images/main3_2.webp', '/images/main3_3.webp'] },
    { id: 2, side: 'right', initialY: 30, xOffset: 100, image: '/images/sign2.webp', popupImages: ['/images/main4_1.webp', '/images/main4_2.webp', '/images/main4_3.webp'] },
    { id: 3, side: 'left', initialY: -30, xOffset: -40, image: '/images/sign3.webp', popupImages: ['/images/main1_1.webp', '/images/main1_2.webp', '/images/main1_3.webp'] },
    { id: 4, side: 'right', initialY: -80, xOffset: -10, image: '/images/sign4.webp', popupImages: ['/images/main2_1.webp', '/images/main2_2.webp', '/images/main2_3.webp'] },
    { id: 5, side: 'left', initialY: -120, xOffset: 100, image: '/images/sign5.webp', popupImages: ['/images/free1_1.webp', '/images/free1_2.webp']  },
    { id: 6, side: 'right', initialY: -160, xOffset: -160, image: '/images/sign6.webp', popupImages: ['/images/free6_1.webp', '/images/free6_2.webp'] },
    { id: 7, side: 'left', initialY: -200, xOffset: 240, image: '/images/sign7.webp', popupImages: ['/images/free2_1.webp', '/images/free2_2.webp'] },
    { id: 8, side: 'right', initialY: -250, xOffset: -230, image: '/images/sign8.webp', popupImages: ['/images/free5_1.webp', '/images/free5_2.webp'] },
    { id: 9, side: 'left', initialY: -290, xOffset: 410, image: '/images/sign9.webp', popupImages: ['/images/free4_1.webp', '/images/free4_2.webp', '/images/free4_3.webp'] },
    { id: 10, side: 'right', initialY: -349, xOffset: -350, image: '/images/sign10.webp', popupImages: ['/images/free3_1.webp', '/images/free3_2.webp'] }
  ], []);

  const calcYMove = useCallback((initialY, progress) => initialY + progress * Y_MOVE_AMOUNT, []);

  const isVisible = useCallback((yMove) => {
    const vh = window.innerHeight;
    return yMove > -vh * 0.3 && yMove < vh * 1.3;
  }, []);

  const [renderTrigger, setRenderTrigger] = useState(0);
  useEffect(() => {
    setRenderTrigger((n) => n + 1);
  }, [progressRef.current]);

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
        zIndex: sign.side === 'left'
        ? Math.floor(-sign.initialY + 1000)  // 왼쪽은 yMove에 반대로 크게
        : Math.floor(-sign.initialY + 1500),  // 오른쪽은 기존대로
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        willChange: opacity > 0 ? 'transform, opacity' : 'auto',
      };
      return acc;
    }, {});

  }, [visibleSigns, calcYMove]);

  const [popupImages, setPopupImages] = useState([]);
  const handleSignClick = useCallback((sign) => {
    // 가장 단순하고 확실한 방법: 파일명 전체를 기준으로 정렬
    const sortedImages = [...(sign.popupImages || [])].sort((a, b) => {
      // 파일명 전체를 문자열로 비교하되, 숫자 부분만 고려
      const aNum = a.substring(a.lastIndexOf('_') + 1, a.lastIndexOf('.'));
      const bNum = b.substring(b.lastIndexOf('_') + 1, b.lastIndexOf('.'));
      
      // 숫자로 변환해서 비교
      return Number(aNum) - Number(bNum);
    });
  
    console.log('Original images:', sign.popupImages);
    console.log('Sorted images:', sortedImages);
  
    setSelectedSign(sign);
    setPopupImages(sortedImages);
    setPopupVisible(true);
  }, []);

  const closePopup = useCallback(() => {
    setPopupVisible(false);
    setSelectedSign(null);
  }, []);

  const handlePopupBackgroundClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  }, [closePopup]);

  const handleSetlistClick = useCallback(() => {
    navigate('/setlist');
  }, [navigate]);

  return (
    <div className={styles.scrollContainer}>
   
        <h1 className={styles.title}>Scroll  and  click  signs!</h1>
        <img
          src="/images/back.webp" // ← 너가 만든 이미지 경로
          alt="back"
          className={styles.backButton}
          onClick={handleBack}
        />
  
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

        {visibleSigns.map(sign => {
  const style = signStyles[sign.id];
  if (!style || style.opacity === 0) return null;
  return (
    <div
      key={sign.id}
      className={styles.sign}
      style={style}
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
        <img src="/images/setlist.webp" alt="setlist" className={styles.setlist} onClick={handleSetlistClick} />
      </div>

      {popupVisible && selectedSign && popupImages.length > 0 && (
  <div className={styles.popupOverlay} onClick={handlePopupBackgroundClick}>
    <div className={styles.popupContent}>
      <button className={styles.closeButton} onClick={closePopup}>×</button>
      <div className={styles.slider}>
        {popupImages.map((img, i) => (
          <img
            key={`${selectedSign.id}-${i}`}
            src={img}
            alt={`popup-${i}`}
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
