import React from 'react';
import styles from '../styles/setlist.module.css'; // 따로 스타일링할 경우

const SetlistPage = () => {
  return (
    <div className={styles.container}>
      <img src="/images/main3.webp" alt="main3" className={styles.main3} />
      <ul className={styles.songList}>
        <li>(v)예지 (g)이은서 천범 (b)규정 (k)최은서 (d)택진</li>
        <li>푸른산호초</li>
        <li>혜성 - 윤하</li>
        <li>Pretender - 오피셜히게단디즘</li>
      </ul>
    </div>
  );
};

export default SetlistPage;
