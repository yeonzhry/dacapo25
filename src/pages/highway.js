import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/highway.module.css';

const SCROLL_MAX = 5000;
const Y_MOVE_AMOUNT = 800;
const X_MOVE_AMOUNT = 1200;

const Highway = () => {
  const navigate = useNavigate();

  // progress를 ref로 관리 (상태 변화를 줄이기 위함)
  const progressRef = useRef(0);
  // 리렌더링 강제용 더미 상태 (변경량 임계치 초과 시에만 변경)
  const [, forceRender] = useState(0);

  // 팝업 상태
  const [selectedSign, setSelectedSign] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  // -- vh 변수 세팅 (1회만)
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--fixed-vh', `${vh}px`);
  }, []);

  // 스크롤 핸들러 최적화 (raf + passive)
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

  // signs 배열 메모이제이션
  const signs = useMemo(() => [
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
  ], []);

  // yMove 계산 함수 (재사용)
  const calcYMove = useCallback((initialY, progress) => initialY + progress * Y_MOVE_AMOUNT, []);

  // 화면 가시 범위 내 필터링 함수
  const isVisible = useCallback((yMove) => {
    const vh = window.innerHeight;
    return yMove > -vh * 0.3 && yMove < vh * 1.3;
  }, []);

  // visibleSigns 메모이제이션
  const visibleSigns = useMemo(() => {
    return signs.filter(sign => {
      const yMove = calcYMove(sign.initialY, progressRef.current);
      return isVisible(yMove);
    });
  }, [signs, calcYMove, isVisible, progressRef.current]); // progressRef.current 직접 참조 불가하니 아래 수정 필요

  // progressRef.current는 useMemo 의존성 배열에 직접 못 들어가므로 workaround:
  // progress를 강제 리렌더링할 때 'forceRender'가 변하므로 이를 의존성에 넣어야 합니다.
  // 따라서 visibleSigns 재계산을 위해 별도의 상태로 progress를 받아야 함
  // 그러므로 아래 코드 수정 필요

  // 아래 상태 추가해서 visibleSigns 의존성에 넣기
  const [renderTrigger, setRenderTrigger] = useState(0);
  useEffect(() => {
    // forceRender 가 호출될 때마다 renderTrigger 업데이트
    setRenderTrigger((n) => n + 1);
  }, [progressRef.current]);

  // visibleSigns 재정의 (renderTrigger에 의존)
  const visibleSigns2 = useMemo(() => {
    return signs.filter(sign => {
      const yMove = calcYMove(sign.initialY, progressRef.current);
      return isVisible(yMove);
    });
  }, [signs, calcYMove, isVisible, renderTrigger]);

  // 스타일 메모이제이션 (visibleSigns2 기준)
  const signStyles = useMemo(() => {
    return visibleSigns2.reduce((acc, sign) => {
      const yMove = calcYMove(sign.initialY, progressRef.current);
      const xMove = sign.side === 'left'
        ? sign.xOffset - progressRef.current * X_MOVE_AMOUNT
        : sign.xOffset + progressRef.current * X_MOVE_AMOUNT;
      const scale = Math.max(0.3, Math.min(2, 1 + progressRef.current * 1.5));
      const opacity = yMove > -31 ? Math.max(0, Math.min(1, 1 - yMove / 600)) : 0;

      acc[sign.id] = {
        transform: `translate3d(${xMove}px, ${yMove}px, 0) scale(${scale})`,
        opacity,
        zIndex: Math.floor(-yMove + 100),
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        // will-change는 GPU 낭비 우려로 visible인 경우에만
        willChange: opacity > 0 ? 'transform, opacity' : 'auto',
      };
      return acc;
    }, {});
  }, [visibleSigns2, progressRef.current, calcYMove]);

  // 팝업 열기/닫기 핸들러
  const handleSignClick = useCallback((sign) => {
    setSelectedSign(sign);
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

  // 네비게이션 핸들러
  const handleSetlistClick = useCallback(() => {
    navigate('/setlist');
  }, [navigate]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.viewport}>
        {/* 배경 및 고정 이미지 */}
        <img src="/images/bg.webp" alt="bg" className={styles.bg} loading="lazy" />
        <img src="/images/img19.webp" alt="car" className={styles.car} loading="lazy" />
        {/* ... 이하 이미지들 동일 유지 ... */}
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

        {/* 보이는 사인들만 렌더링 */}
        {visibleSigns2.map((sign) => (
          <div
            key={sign.id}
            className={styles.sign}
            style={signStyles[sign.id]}
            onClick={() => handleSignClick(sign)}
          >
            <img src={sign.image} alt={`Sign ${sign.id}`} className={styles.signBoard} loading="lazy" />
            <div className={styles.clickArea}></div>
          </div>
        ))}

        {/* 도로 및 필터, 세트리스트 */}
        <img src="/images/img17.webp" alt="road" className={styles.road} loading="lazy" />
        <img src="/images/img18.webp" alt="road" className={styles.road} loading="lazy" />
        <img src="/images/filter.webp" alt="filter" className={styles.bgFilter} loading="lazy" />
        <img src="/images/setlist.png" alt="setlist" className={styles.setlist} onClick={handleSetlistClick} />
      </div>

      {/* 팝업 */}
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
