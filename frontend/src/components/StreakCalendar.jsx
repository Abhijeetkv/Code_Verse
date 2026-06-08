import React, { useMemo } from "react";
import { FlameIcon, CalendarIcon, TrophyIcon } from "lucide-react";

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const StreakCalendar = ({ submissions = {}, streakData = {} }) => {
  const { currentStreak = 0, maxStreak = 0, totalActiveDays = 0 } = streakData;

  // Generate last 20 weeks of dates
  const weeks = useMemo(() => {
    const result = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun

    // Start from the beginning of the week, 19 weeks ago
    const start = new Date(today);
    start.setDate(start.getDate() - dayOfWeek - 19 * 7);

    for (let w = 0; w < 20; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const ds = date.toISOString().split("T")[0];
        const count = submissions[ds] || 0;
        const isFuture = date > today;
        week.push({ date: ds, count, isFuture });
      }
      result.push(week);
    }
    return result;
  }, [submissions]);

  const getIntensity = (count) => {
    if (count === 0) return "streak-cell-0";
    if (count === 1) return "streak-cell-1";
    if (count === 2) return "streak-cell-2";
    if (count <= 4) return "streak-cell-3";
    return "streak-cell-4";
  };

  const monthLabels = useMemo(() => {
    const labels = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const start = new Date(today);
    start.setDate(start.getDate() - dayOfWeek - 19 * 7);

    let lastMonth = -1;
    for (let w = 0; w < 20; w++) {
      const d = new Date(start);
      d.setDate(start.getDate() + w * 7);
      const month = d.getMonth();
      if (month !== lastMonth) {
        labels.push({ week: w, label: d.toLocaleDateString("en-US", { month: "short" }) });
        lastMonth = month;
      }
    }
    return labels;
  }, []);

  return (
    <div className="streak-calendar-card">
      {/* Header */}
      <div className="streak-header">
        <div className="streak-header-left">
          <div className="streak-icon-wrap">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="streak-title">Submission Activity</h3>
            <p className="streak-subtitle">
              {totalActiveDays} active day{totalActiveDays !== 1 ? "s" : ""} in the last 20 weeks
            </p>
          </div>
        </div>
      </div>

      {/* Streak Counters */}
      <div className="streak-counters">
        <div className="streak-counter-item">
          <div className="streak-counter-icon fire">
            <FlameIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="streak-counter-value">{currentStreak}</span>
            <span className="streak-counter-label">Current Streak</span>
          </div>
        </div>
        <div className="streak-counter-item">
          <div className="streak-counter-icon trophy">
            <TrophyIcon className="w-4 h-4" />
          </div>
          <div>
            <span className="streak-counter-value">{maxStreak}</span>
            <span className="streak-counter-label">Max Streak</span>
          </div>
        </div>
      </div>

      {/* Unified Heatmap Grid */}
      <div className="streak-heatmap">
        {/* Month labels — row 1, columns aligned to their week */}
        {monthLabels.map((m, i) => (
          <span
            key={i}
            className="streak-month-label"
            style={{ gridColumn: m.week + 2, gridRow: 1 }}
          >
            {m.label}
          </span>
        ))}

        {/* Day rows (Sun=0 … Sat=6) */}
        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
          <React.Fragment key={dayIndex}>
            {/* Day label in column 1 */}
            <span
              className="streak-day-label"
              style={{ gridColumn: 1, gridRow: dayIndex + 2 }}
            >
              {DAY_LABELS[dayIndex]}
            </span>

            {/* One cell per week for this day */}
            {weeks.map((week, wi) => {
              const day = week[dayIndex];
              return (
                <div
                  key={wi}
                  className={`streak-cell ${
                    day.isFuture
                      ? "streak-cell-future"
                      : getIntensity(day.count)
                  }`}
                  style={{ gridColumn: wi + 2, gridRow: dayIndex + 2 }}
                  title={
                    day.isFuture
                      ? ""
                      : `${day.date}: ${day.count} submission${day.count !== 1 ? "s" : ""}`
                  }
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="streak-legend">
        <span className="streak-legend-label">Less</span>
        <div className="streak-cell streak-cell-0" />
        <div className="streak-cell streak-cell-1" />
        <div className="streak-cell streak-cell-2" />
        <div className="streak-cell streak-cell-3" />
        <div className="streak-cell streak-cell-4" />
        <span className="streak-legend-label">More</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
