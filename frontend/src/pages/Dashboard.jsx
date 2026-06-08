import React, { useState, useMemo } from "react";
import DashNavbar from "../components/DashNavbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useCreateSession, useActiveSessions } from "../hooks/useSessions";
import { useProgress } from "../hooks/useProgress";
import { PROBLEMS } from "../data/problem.js";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import StreakCalendar from "../components/StreakCalendar";
import SolvedProgress from "../components/SolvedProgress";
import CreateSessionModel from "../components/CreateSessionModel";

const Dashboard = () => {
  const navigate = useNavigate();
  const {user} = useUser()
  const [showCreateModel, setShowCreateModel] = useState(false)
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: ""});

  const createSessionMutation = useCreateSession();

  const { data: activeSessionData, isLoading: loadingActiveSessions } = useActiveSessions();

  const allProblems = useMemo(() => Object.values(PROBLEMS), []);
  const { solvedCount, streakData, submissions, getSolvedByDifficulty } = useProgress(PROBLEMS);

  const solvedByDifficulty = getSolvedByDifficulty();
  const totalByDifficulty = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    for (const p of allProblems) {
      const d = p.difficulty?.toLowerCase();
      if (d === "easy") easy++;
      else if (d === "medium") medium++;
      else if (d === "hard") hard++;
    }
    return { easy, medium, hard };
  }, [allProblems]);

  const handleCreateRoom = () => {
    if(!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate({
      problem: roomConfig.problem,
      difficulty: roomConfig.difficulty.toLowerCase(),
    },
  {
      onSuccess: (data) => {
        setShowCreateModel(false);
        navigate(`/session/${data.session._id}`); 
      }
  })
  
  }

  const activeSessions = activeSessionData?.sessions || []

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId ===user.id || session.participant?.clerkId === user.id
  }

  return (
    <>
      <div className="min-h-screen" style={{ background: 'var(--slate-950)' }}>
        <DashNavbar />

        <WelcomeSection onCreateSession={() => setShowCreateModel(true)} />

        <div className="max-w-7xl mx-auto px-6 pb-16">
          {/* Row 1: Solved Progress + Streak Calendar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 fade-up">
            <div className="lg:col-span-1">
              <SolvedProgress
                solvedByDifficulty={solvedByDifficulty}
                totalByDifficulty={totalByDifficulty}
              />
            </div>
            <div className="lg:col-span-2">
              <StreakCalendar
                submissions={submissions}
                streakData={streakData}
              />
            </div>
          </div>

          {/* Row 2: Stats + Active Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 fade-up delay-1">
            <div className="lg:col-span-1">
              <StatsCards 
                activeSessionsCount={activeSessions.length}
                solvedCount={solvedCount}
              />
            </div>
            <div className="lg:col-span-3">
              <ActiveSessions
                sessions={activeSessions}
                isLoading={loadingActiveSessions}
                isUserInSession={isUserInSession}
              />
            </div>
          </div>
        </div>
      </div>

      <CreateSessionModel
        isOpen={showCreateModel}
        onClose={() => setShowCreateModel(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreate={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
};

export default Dashboard;
