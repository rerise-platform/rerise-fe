import React from "react";
import "../components/MissionCard.css";

export default function MissionCard({ mission, onComplete }) {
  return (
    <div className="mission-card">
      <p className="mission-title">{mission.content}</p>
      <button
        className={`mission-btn ${mission.completed ? "done" : ""}`}
        disabled={mission.completed}
        onClick={() => onComplete(mission.id)}
      >
        {mission.completed ? "완료됨" : "미션 완료하기"}
      </button>
    </div>
  );
}
