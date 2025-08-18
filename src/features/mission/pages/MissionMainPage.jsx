import React from "react";
import "../pages/MissionMainPage.css";

const MissionMainPage = () => {
  return (
    <div className="mission-page">
      {/* 상단 타이틀 */}
      <h2 className="mission-title">미션</h2>

      {/* 카테고리 버튼 */}
      <div className="mission-category">데일리 미션</div>

      {/* 설명 */}
      <p className="mission-desc">
        미션을 완료하면 <br></br>
        <span className="highlight">EXP +10</span> 을 드려요
      </p>

      {/* 메인 이미지 */}
      <div className="mission-main-icon">
        <img src="/images/mission.png" alt="main mission" />
      </div>

      {/* 리워드 아이콘들 */}
      <div className="mission-rewards">
        <div className="reward">
          <img src="/images/mission2.png" alt="reward" />
          <p>+ 10</p>
        </div>
        <div className="reward">
          <img src="/images/mission2.png" alt="reward" />
          <p>+ 10</p>
        </div>
        <div className="reward">
          <img src="/images/mission3.png" alt="reward" />
          <p
            style={{
              fontSize: "14px",
              color: "#999",
            }}
          >
            + 10
          </p>
        </div>
        <div className="reward">
          <img src="/images/mission3.png" alt="reward" />
          <p
            style={{
              fontSize: "14px",
              color: "#999",
            }}
          >
            + 15
          </p>
        </div>
      </div>

      {/* 미션 카드들 */}
      <div className="mission-list">
        <div className="mission-card">
          <p>가족이나 친구에게 간단한 안부 메시지 보내기</p>
          <button>미션 진행하기</button>
        </div>
        <div className="mission-card">
          <p>밤/저녁/새벽 명상 10분</p>
          <button className="disabled">미션 완료</button>
        </div>
        <div className="mission-card">
          <p>잠들기 전 5분 스트레칭 또는 명상하기</p>
          <button>미션 진행하기</button>
        </div>
        <div className="mission-card">
          <p>오늘 할 가지 새로운 행동 시도하기</p>
          <button>미션 진행하기</button>
        </div>
      </div>

      <div className="roadmap-section">
        <div className="roadmap-badge">로드맵 미션</div>

        <h3>
          <div className="text-wrapper">
            좀 더 어려운 <br />
            미션에 도전해보세요
          </div>
        </h3>

        <ul className="roadmap-list">
          <li className="roadmap-item done">
            <span>30분 산책하기!</span>
            <img src="/images/missionChecked.png" alt="checked" />
          </li>
          <li className="roadmap-item pending">
            <span>그림, 글, 음악 등 5분 창작 활동하기!</span>
            <img src="/images/missionUnchecked.png" alt="unchecked" />
          </li>
          <li className="roadmap-item pending">
            <span>오늘 겪은 감정과 행동을 분석해 보기!</span>
            <img src="/images/missionUnchecked.png" alt="unchecked" />
          </li>
        </ul>

        <div className="roadmap-feedback">
          <div className="feedback-head">
            <img src="/images/missionChecked.png" alt="checked" />
            <span style={{ color: "rgba(50, 176, 103, 1)" }}>
              간단한 후기를 작성해보세요
            </span>
          </div>
          <br></br>
          <div>{<textarea />}</div>
        </div>
      </div>
    </div>
  );
};

export default MissionMainPage;
