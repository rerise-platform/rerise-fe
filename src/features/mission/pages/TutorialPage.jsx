import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TutorialPage.css";

function TutorialPage() {
  const [index, setIndex] = useState(0); // 0,1,2
  const navigate = useNavigate();

  const startX = useRef(0);
  const deltaX = useRef(0);
  const isDragging = useRef(false);

  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

  // 포인터(터치/마우스) 공통 스와이프
  const onPointerDown = (e) => {
    isDragging.current = true;
    startX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    deltaX.current = 0;
  };
  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const curX = "touches" in e ? e.touches[0].clientX : e.clientX;
    deltaX.current = curX - startX.current;
  };
  const onPointerUp = () => {
    if (!isDragging.current) return;
    const threshold = 60;
    if (deltaX.current <= -threshold) setIndex((i) => clamp(i + 1, 0, 2));
    else if (deltaX.current >= threshold) setIndex((i) => clamp(i - 1, 0, 2));
    isDragging.current = false;
    deltaX.current = 0;
  };

  const goTest = () => navigate("/test");

  return (
    <div
      className="tutorial-page"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div
        className="slider"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {/* 1 */}
        <section className="slide">
          <h2 className="title">일일 미션</h2>
          <div className="image-wrap">
            <img
              src="/images/mission.png"
              alt="일일 미션"
              className="hero-img"
            />
          </div>
          <p className="desc">
            하루에 가벼운 도전!
            <br />
            작은 습관이 쌓여 당신의 오늘을 더 단단하게 만듭니다.
          </p>
        </section>

        {/* 2 */}
        <section className="slide">
          <h2 className="title">로드맵 미션</h2>
          <div className="image-wrap">
            <img
              src="/images/roadmap.png"
              alt="로드맵 미션"
              className="hero-img roadmap-img"
            />
          </div>
          <p className="desc">
            주 3회, 한 걸음 더 깊은 도전!
            <br />
            당신의 속도에 맞춰 난이도가 조정됩니다.
            <br />
            조금씩 성장하는 자신을 느껴보세요.
          </p>
        </section>

        {/* 3 */}

        <section className="slide">
          <h2 className="title ">캐릭터 진화</h2>
          {/* 캐릭터만 전체 폭 사용 */}
          <div className="image-wrap">
            <div className="char-marquee-viewport">
              <div className="char-marquee-track">
                <img src="/images/char1.png" alt="char1" className="char-img" />
                <img src="/images/char2.png" alt="char2" className="char-img" />
                <img src="/images/char3.png" alt="char3" className="char-img" />
                {/* 루프용 복제 세트 */}
                <img
                  src="/images/char1.png"
                  alt="char1 dup"
                  className="char-img"
                />
                <img
                  src="/images/char2.png"
                  alt="char2 dup"
                  className="char-img"
                />
                <img
                  src="/images/char3.png"
                  alt="char3 dup"
                  className="char-img"
                />
                <img
                  src="/images/char1.png"
                  alt="char1 dup"
                  className="char-img"
                />
                <img
                  src="/images/char2.png"
                  alt="char2 dup"
                  className="char-img"
                />
                <img
                  src="/images/char3.png"
                  alt="char3 dup"
                  className="char-img"
                />
              </div>
            </div>
          </div>
          <p className="desc">
            EXP로 성장하는 캐릭터!
            <br />
            당신의 걸음이 EXP가 되어 쌓이고,
            <br />그 힘으로 캐릭터가 자라납니다.
          </p>
        </section>
      </div>

      {/* 인디케이터 */}
      <div className="dots">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            aria-label={`go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="footer">
        <button
          className={`start-btn ${index === 2 ? "enabled" : "disabled"}`}
          disabled={index !== 2}
          onClick={goTest}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

export default TutorialPage;
