import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../styles/onboard.module.css'; // CSS Module import

const Onboard = () => {
  const [text, setText] = useState('');
  const fullText = 'Highway to';
  const [index, setIndex] = useState(0);
  const [slideUp, setSlideUp] = useState(false);

  const navigate = useNavigate();

  // 타이핑 애니메이션
  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText.charAt(index));
        setIndex(index + 1);
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      // 타이핑 끝난 후 0.8초 뒤에 슬라이드 업 시작
      const timer = setTimeout(() => {
        setSlideUp(true);
      }, 1500);

      // 슬라이드 업 애니메이션(1.5초) 끝나면 페이지 이동
      const navTimer = setTimeout(() => {
        navigate('/main');
      }, 1500 + 1200);

      return () => {
        clearTimeout(timer);
        clearTimeout(navTimer);
      };
    }
  }, [index, fullText, navigate]);

  return (
    <div className={`${styles.wrapper} ${slideUp ? styles.slideUp : ''}`}>
      <div className={styles.bgFilter}></div>

      <div className={styles.container}>
        <h1 className={styles.typingText}>{text}</h1>
        <div className={styles.bracketWrapper}>
          <span className={styles.bracket}>[</span>
          <span className={styles.bracket}>]</span>
        </div>
      </div>
    </div>
  );
};

export default Onboard;