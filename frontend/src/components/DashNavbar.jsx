import React from "react";
import logo from "../assets/logo.svg";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { FlameIcon, LayoutDashboard } from "lucide-react";

const DashNavbar = () => {
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div
        className="px-5 py-2 lg:py-3 lg:px-30"
        style={{
          borderBottom: "1px solid var(--slate-800)",
          background: "rgba(12, 12, 20, 0.8)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center justify-between">
          <Link to="/">
            <div className="flex items-center">
              <img src={logo} alt="" className="h-12 w-12 pt-2" />
              <p
                className="text-xl pt-3 px-1 font-bold sm:text-2xl"
                style={{ color: "var(--slate-100)" }}
              >
                CodeVerse
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to={"/problems"}
              className={`px-4 py-2.5 rounded-lg transition-all duration-200`}
              style={{
                background: isActive("/problems")
                  ? "var(--indigo-500)"
                  : "transparent",
                color: isActive("/problems")
                  ? "white"
                  : "var(--slate-400)",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/problems")) {
                  e.currentTarget.style.background = "var(--slate-800)";
                  e.currentTarget.style.color = "var(--slate-100)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/problems")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--slate-400)";
                }
              }}
            >
              <div className="flex items-center gap-x-2.5">
                <FlameIcon className="size-4" />
                <span className="font-medium hidden sm:inline">Problems</span>
              </div>
            </Link>

            <Link
              to={"/dashboard"}
              className={`px-4 py-2.5 lg:mr-4 rounded-lg transition-all duration-200`}
              style={{
                background: isActive("/dashboard")
                  ? "var(--indigo-500)"
                  : "transparent",
                color: isActive("/dashboard")
                  ? "white"
                  : "var(--slate-400)",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/dashboard")) {
                  e.currentTarget.style.background = "var(--slate-800)";
                  e.currentTarget.style.color = "var(--slate-100)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/dashboard")) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--slate-400)";
                }
              }}
            >
              <div className="flex items-center gap-x-2.5">
                <LayoutDashboard className="size-4" />
                <span className="font-medium hidden sm:inline">Dashboard</span>
              </div>
            </Link>

            <UserButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashNavbar;
