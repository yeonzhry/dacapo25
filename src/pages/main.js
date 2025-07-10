// src/pages/Main.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/main.module.css';

const Main = () => {
  const navigate = useNavigate();
  const [showOnboard, setShowOnboard] = useState(true);
  const fullText = 'Highway to';
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const [slideUp, setSlideUp] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    if (!showOnboard) return;

    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      // 타이핑 끝난 후 1.5초 뒤에 slideUp 시작
      const slideTimer = setTimeout(() => {
        setSlideUp(true);
      }, 1500);

      // slideUp 애니메이션 끝난 후 (예: 1.5초) start 버튼 보여주기
      const showStartTimer = setTimeout(() => {
        setShowStartButton(true);
      }, 1500 + 1500);

      return () => {
        clearTimeout(slideTimer);
        clearTimeout(showStartTimer);
      };
    }
  }, [index, fullText, showOnboard]);

  const handleStart = () => {
    navigate('/highway'); // '/next' 경로를 원하는 페이지로 수정하세요
  };

  return (
    <div className={styles.canvas}>
      <div className={styles.bgFilter}></div>

      <div className={`${styles.wrapper} ${slideUp ? styles.slideUp : ''}`}>
        <div className={styles.container}>
          <h1 className={styles.typingText}>{text}</h1>
          <div className={styles.bracketWrapper}>
            <span className={styles.bracket}>[</span>
            <span className={styles.bracket}>]</span>
          </div>
        </div>
        {showStartButton && (
          <img
            src="/images/start.png"
            alt="Start"
            className={styles.start}
            onClick={handleStart}
          />
        )}
      </div>

      <img src="/images/bg.webp" alt="bg" className={styles.bg} />
      <img src="/images/dacapo2.png" alt="bg" className={styles.dacapo} loading="lazy"/>
      <img src="/images/img1.webp" alt="img1" className={styles.img1} loading="lazy"/>
      <img src="/images/img2.webp" alt="img2" className={styles.img2} loading="lazy"/>
      <img src="/images/img3.webp" alt="img3" className={styles.img3} loading="lazy"/>
      <img src="/images/img4.webp" alt="img4" className={styles.img4} loading="lazy"/>
      <img src="/images/img5.webp" alt="img5" className={styles.img5} loading="lazy"/>
      <img src="/images/img6.webp" alt="img6" className={styles.img6} loading="lazy"/>
      <img src="/images/img7.webp" alt="img7" className={styles.img7} loading="lazy"/>
      <img src="/images/img8.webp" alt="img8" className={styles.img8} loading="lazy"/>
      <img src="/images/img9.webp" alt="img9" className={styles.img9} loading="lazy"/>
      <img src="/images/img10.webp" alt="img10" className={styles.img10} loading="lazy"/>
      <img src="/images/img11.webp" alt="img11" className={styles.img11} loading="lazy"/>
      <img src="/images/img12.webp" alt="img12" className={styles.img12} loading="lazy"/>
      <img src="/images/img13.webp" alt="img13" className={styles.img13} loading="lazy"/>
      <img src="/images/img14.webp" alt="img14" className={styles.img14} loading="lazy"/>
      <img src="/images/img15.webp" alt="img15" className={styles.img15} loading="lazy"/>
      <img src="/images/img16.webp" alt="img16" className={styles.img16} loading="lazy"/>
      <img src="/images/img17.webp" alt="img17" className={styles.img17} loading="lazy"/>
      <img src="/images/img18.webp" alt="img18" className={styles.img18} loading="lazy"/>
      <img src="/images/img19.webp" alt="img19" className={styles.img19} loading="lazy"/>
      <img src="/images/img20.webp" alt="img20" className={styles.img20} loading="lazy"/>
      <img src="/images/img21.webp" alt="img21" className={styles.img21} loading="lazy"/>
      <img src="/images/img22.webp" alt="img22" className={styles.img22} loading="lazy"/>
      <img src="/images/img23.webp" alt="img23" className={styles.img23} loading="lazy"/>
      <img src="/images/img24.webp" alt="img24" className={styles.img24} loading="lazy"/>
      <img src="/images/img25.webp" alt="img25" className={styles.img25} loading="lazy"/>
      <img src="/images/img26.webp" alt="img26" className={styles.img26} loading="lazy"/>
    </div>
  );
};

export default Main;
