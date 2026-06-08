import React, { useMemo } from "react";
import { CheckCircleIcon } from "lucide-react";

const SolvedProgress = ({ solvedByDifficulty, totalByDifficulty }) => {
  const { easy: solvedEasy = 0, medium: solvedMedium = 0, hard: solvedHard = 0 } = solvedByDifficulty;
  const { easy: totalEasy = 0, medium: totalMedium = 0, hard: totalHard = 0 } = totalByDifficulty;

  const totalSolved = solvedEasy + solvedMedium + solvedHard;
  const totalProblems = totalEasy + totalMedium + totalHard;

  // SVG donut ring helper
  const DonutRing = ({ solved, total, color, radius, strokeWidth }) => {
    const circumference = 2 * Math.PI * radius;
    const progress = total > 0 ? solved / total : 0;
    const dashOffset = circumference * (1 - progress);

    return (
      <>
        {/* Background ring */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="donut-progress"
          transform="rotate(-90 80 80)"
        />
      </>
    );
  };

  return (
    <div className="solved-progress-card">
      {/* Header */}
      <div className="solved-header">
        <div className="solved-icon-wrap">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
        <h3 className="solved-title">Problems Solved</h3>
      </div>

      <div className="solved-content">
        {/* Donut Chart */}
        <div className="donut-container">
          <svg viewBox="0 0 160 160" className="donut-svg">
            <DonutRing solved={solvedHard} total={totalHard} color="#f43f5e" radius={70} strokeWidth={8} />
            <DonutRing solved={solvedMedium} total={totalMedium} color="#fbbf24" radius={58} strokeWidth={8} />
            <DonutRing solved={solvedEasy} total={totalEasy} color="#34d399" radius={46} strokeWidth={8} />
          </svg>
          <div className="donut-center">
            <span className="donut-center-value">{totalSolved}</span>
            <span className="donut-center-label">/ {totalProblems}</span>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="solved-breakdown">
          <div className="solved-breakdown-item">
            <div className="solved-breakdown-header">
              <span className="solved-dot easy" />
              <span className="solved-difficulty-label">Easy</span>
            </div>
            <div className="solved-breakdown-bar">
              <div className="solved-bar-track">
                <div
                  className="solved-bar-fill easy"
                  style={{ width: `${totalEasy > 0 ? (solvedEasy / totalEasy) * 100 : 0}%` }}
                />
              </div>
              <span className="solved-fraction">
                <strong>{solvedEasy}</strong>/{totalEasy}
              </span>
            </div>
          </div>

          <div className="solved-breakdown-item">
            <div className="solved-breakdown-header">
              <span className="solved-dot medium" />
              <span className="solved-difficulty-label">Medium</span>
            </div>
            <div className="solved-breakdown-bar">
              <div className="solved-bar-track">
                <div
                  className="solved-bar-fill medium"
                  style={{ width: `${totalMedium > 0 ? (solvedMedium / totalMedium) * 100 : 0}%` }}
                />
              </div>
              <span className="solved-fraction">
                <strong>{solvedMedium}</strong>/{totalMedium}
              </span>
            </div>
          </div>

          <div className="solved-breakdown-item">
            <div className="solved-breakdown-header">
              <span className="solved-dot hard" />
              <span className="solved-difficulty-label">Hard</span>
            </div>
            <div className="solved-breakdown-bar">
              <div className="solved-bar-track">
                <div
                  className="solved-bar-fill hard"
                  style={{ width: `${totalHard > 0 ? (solvedHard / totalHard) * 100 : 0}%` }}
                />
              </div>
              <span className="solved-fraction">
                <strong>{solvedHard}</strong>/{totalHard}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolvedProgress;
