import React, { useEffect } from 'react'; // useEffect import 되어야 함
import { useNavigate } from 'react-router-dom';

import styles from '../styles/setlist.module.css';

const SetlistPage = () => {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // 또는 원하는 경로 예: navigate('/')
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' }); // 또는 behavior: 'smooth'
  }, []);
  return (
    <div className={styles.container}>
      <img
          src="/images/back.webp" // ← 너가 만든 이미지 경로
          alt="back"
          className={styles.backButton}
          onClick={handleBack}
        />
      <img src="/images/bg3.webp" alt="bg" className={styles.bg} />
      <img src="/images/filter.webp" alt="filter" className={styles.bgFilter} loading="lazy" />

      {/* <img src="/images/1.webp" alt="bg" className={styles.img1} /> */}


      <div className={styles.content}>
        <h1 className={styles.title}>SETLIST</h1>
        <section className={styles.section}>
          <h2 className={styles.partTitle}>1부</h2>

          <div className={styles.team}>
            <p className={styles.members}>(v)예지 (g)희제 윤환 (b)윤석 (k)윤서 (d)현종</p>
            <ul className={styles.songList}>
              <li>푸른 산호초 - Seioko Matsuda</li>
              <li>혜성 - 윤하</li>
              <li>Pretender - Official Hige Dandism</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)정운 (g)이은서 천범 (b)규정 (k)최은서 (d)택진</p>
            <ul className={styles.songList}>
              <li>Marigold - Aimyon</li>
              <li>비틀비틀 짝짜꿍 - 한로로</li>
              <li>오르트구름 - 윤하</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)민주 (g)건호 기완 (b)연재 (k)수영 (d)현지</p>
            <ul className={styles.songList}>
              <li>Champagne Supernova - 백예린(Cover)</li>
              <li>Kaiju no hanauta - Vaundy</li>
              <li>나에게로 떠나는여행 - 버즈</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)민주 (g)승주 기완 (b)정연 (k)현진 (d)민경</p>
            <ul className={styles.songList}>
              <li>입춘 - 한로로</li>
              <li>Drowning - 우즈</li>
              <li>비밀번호 486 - 윤하</li>
            </ul>
          </div>

          
        </section>

        {/* 2부 */}
        <section className={styles.section}>
          <h2 className={styles.partTitle}>2부</h2>

          <div className={styles.team}>
            <p className={styles.members}>(v)건호 이은서 (g)건호 윤환 (b)연재 (k)윤서 (d)현종</p>
            <ul className={styles.songList}>
              <li>무희- Vaundy</li>
              {/* <li>사랑을전하고 싶다든가 - Aimyon </li> */}
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)승주 건호 (g)승주 건호 (b)규정 (k)윤서 (d)현종</p>
            <ul className={styles.songList}>
              <li>Beggin’ - Maneskin</li>
              <li>Just - Radiohead</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)연재 (g)건호 승주 (b)정연 (k)수영 (d)민경</p>
            <ul className={styles.songList}>
              <li>Tell me if you wanna go home - Keira Knight</li>
              <li>Antifreeze - 검정치마</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)예지 (g)기완 천범 (b)규정 (k)최은서 (d)택진</p>
            <ul className={styles.songList}>
              <li>너에게 닿기를 - 10cm</li>
              <li>Silhoutte - KANA BOON</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)정운 (g)승주 희제 (b)정연 (k)수영 (d)현지</p>
            <ul className={styles.songList}>
              <li>Death by rock and roll - The pretty reckless</li>
              <li>River - Bishop briggs</li>
              <li>Last Day - 터치드</li>
            </ul>
          </div>

          <div className={styles.team}>
            <p className={styles.members}>(v)민주 (g)희제 (b)연재 (k)수영 (d)현지</p>
            <ul className={styles.songList}>
              <li>Love is dangerous - 터치드</li>
              <li>고속도로 로맨스 - 유다빈밴드</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SetlistPage;
