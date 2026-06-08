import { useState, useCallback, useMemo } from "react";

const SOLVED_KEY = "hireverse_solved_problems";
const SUBMISSIONS_KEY = "hireverse_submissions";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function loadSolved() {
  try {
    const raw = localStorage.getItem(SOLVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSolved(arr) {
  localStorage.setItem(SOLVED_KEY, JSON.stringify(arr));
}

function loadSubmissions() {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSubmissions(obj) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(obj));
}

function computeStreak(submissions) {
  const dates = Object.keys(submissions).sort().reverse();
  if (dates.length === 0) return { currentStreak: 0, maxStreak: 0, totalActiveDays: 0 };

  const today = getToday();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  // Check if today or yesterday has a submission to start streak
  const sortedAsc = [...dates].reverse();

  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedAsc[i - 1]);
      const curr = new Date(sortedAsc[i]);
      const diffDays = (curr - prev) / 86400000;
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak);
  }

  // Calculate current streak from today/yesterday backwards
  let checkDate = dates.includes(today) ? today : dates.includes(yesterday) ? yesterday : null;
  if (checkDate) {
    currentStreak = 1;
    let d = new Date(checkDate);
    while (true) {
      d.setDate(d.getDate() - 1);
      const ds = d.toISOString().split("T")[0];
      if (submissions[ds]) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    currentStreak,
    maxStreak,
    totalActiveDays: dates.length,
  };
}

export function useProgress(problems) {
  const [solvedList, setSolvedList] = useState(() => loadSolved());
  const [submissions, setSubmissions] = useState(() => loadSubmissions());

  const solvedSet = useMemo(() => new Set(solvedList), [solvedList]);

  const markProblemSolved = useCallback(
    (problemId) => {
      const today = getToday();

      // Update solved list (only if not already solved)
      setSolvedList((prev) => {
        if (prev.includes(problemId)) return prev;
        const next = [...prev, problemId];
        saveSolved(next);
        return next;
      });

      // Always update submissions (counts both new solves and re-submissions)
      setSubmissions((prev) => {
        const next = { ...prev };
        next[today] = (next[today] || 0) + 1;
        saveSubmissions(next);
        return next;
      });
    },
    []
  );

  const streakData = useMemo(() => computeStreak(submissions), [submissions]);

  const getSolvedByDifficulty = useCallback(
    () => {
      if (!problems) return { easy: 0, medium: 0, hard: 0 };
      const all = Array.isArray(problems) ? problems : Object.values(problems);
      let easy = 0, medium = 0, hard = 0;
      for (const p of all) {
        if (solvedSet.has(p.id)) {
          const d = p.difficulty?.toLowerCase();
          if (d === "easy") easy++;
          else if (d === "medium") medium++;
          else if (d === "hard") hard++;
        }
      }
      return { easy, medium, hard };
    },
    [problems, solvedSet]
  );

  return {
    solvedSet,
    solvedCount: solvedList.length,
    markProblemSolved,
    streakData,
    submissions,
    getSolvedByDifficulty,
  };
}
