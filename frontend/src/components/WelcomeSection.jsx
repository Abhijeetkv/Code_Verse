import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, ZapIcon } from "lucide-react";

const WelcomeSection = ({ onCreateSession }) => {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99, 102, 241, 0.08), transparent)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-xl sm:text-4xl font-black sm:mb-3 mb-1"
              style={{ color: "var(--slate-100)" }}
            >
              Welcome back, {user?.firstName || "there"}!
            </h1>
            <p
              className="text-sm sm:text-lg"
              style={{ color: "var(--slate-400)" }}
            >
              Ready to level up your coding skills?
            </p>
          </div>

          <button
            onClick={onCreateSession}
            className="group px-4 py-3 sm:px-8 sm:py-4 rounded-2xl transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, var(--indigo-600), var(--indigo-500))",
            }}
          >
            <div className="flex items-center lg:gap-3 text-white font-bold md:text-lg">
              <ZapIcon className="w-6 h-6 hidden md:block" />
              <span className="text-xs sm:text-lg">Create Session</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
