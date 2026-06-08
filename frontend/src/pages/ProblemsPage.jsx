import React, { useState, useMemo } from "react";
import DashNavbar from "../components/DashNavbar";
import { SearchIcon, CheckCircle2Icon, CircleIcon, Code2Icon } from "lucide-react";
import { PROBLEMS } from "../data/problem.js";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../hooks/useProgress";
import SolvedProgress from "../components/SolvedProgress";

const ProblemsPage = () => {
  const navigate = useNavigate();
  const problems = useMemo(() => Object.values(PROBLEMS), []);
  const { solvedSet, getSolvedByDifficulty } = useProgress(PROBLEMS);

  const solvedByDifficulty = getSolvedByDifficulty();
  const totalByDifficulty = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    for (const p of problems) {
      const d = p.difficulty?.toLowerCase();
      if (d === "easy") easy++;
      else if (d === "medium") medium++;
      else if (d === "hard") hard++;
    }
    return { easy, medium, hard };
  }, [problems]);

  // Search & filter
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch = `${p.title} ${p.category} ${p.difficulty}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesDifficulty =
        difficultyFilter === "all" ||
        p.difficulty.toLowerCase() === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficultyFilter, problems]);

  // Pagination
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);
  const indexOfLast = currentPage * ITEMS_PER_PAGE;
  const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
  const currentProblems = filteredProblems.slice(indexOfFirst, indexOfLast);

  const goToNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const goToPrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter) => {
    setDifficultyFilter(filter);
    setCurrentPage(1);
  };

  const getFilterBtnClass = (filter) => {
    if (difficultyFilter !== filter) return "problem-filter-btn";
    if (filter === "all") return "problem-filter-btn active";
    return `problem-filter-btn active-${filter}`;
  };

  return (
    <>
      <div className="min-h-screen" style={{ background: "var(--slate-950)" }}>
        <DashNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Page Header */}
          <div className="mb-8 fade-up">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, var(--indigo-600), var(--indigo-500))",
                }}
              >
                <Code2Icon className="w-6 h-6 text-white" />
              </div>
              <h1
                className="text-2xl sm:text-3xl font-black"
                style={{ color: "var(--slate-100)" }}
              >
                Problems
              </h1>
            </div>
            <p style={{ color: "var(--slate-400)" }} className="text-sm sm:text-base ml-[52px]">
              Sharpen your coding skills with curated challenges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Solved Progress */}
            <div className="lg:col-span-1 fade-up delay-1">
              <SolvedProgress
                solvedByDifficulty={solvedByDifficulty}
                totalByDifficulty={totalByDifficulty}
              />
            </div>

            {/* Main - Problem Table */}
            <div className="lg:col-span-3 fade-up delay-2">
              <div className="problem-table-container">
                {/* Search + Filters */}
                <div className="problem-table-header">
                  <div className="problem-search-wrap">
                    <SearchIcon className="w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={search}
                      onChange={handleSearch}
                    />
                  </div>

                  <div className="problem-filters">
                    <button
                      className={getFilterBtnClass("all")}
                      onClick={() => handleFilterChange("all")}
                    >
                      All
                    </button>
                    <button
                      className={getFilterBtnClass("easy")}
                      onClick={() => handleFilterChange("easy")}
                    >
                      Easy
                    </button>
                    <button
                      className={getFilterBtnClass("medium")}
                      onClick={() => handleFilterChange("medium")}
                    >
                      Medium
                    </button>
                    <button
                      className={getFilterBtnClass("hard")}
                      onClick={() => handleFilterChange("hard")}
                    >
                      Hard
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="problem-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>Status</th>
                        <th>Title</th>
                        <th style={{ width: "120px" }}>Difficulty</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProblems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-12"
                            style={{ color: "var(--slate-500)" }}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <Code2Icon className="w-10 h-10 opacity-30" />
                              <p className="font-semibold">No problems found</p>
                              <p className="text-sm opacity-60">Try adjusting your search or filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentProblems.map((problem, idx) => {
                          const isSolved = solvedSet.has(problem.id);
                          return (
                            <tr
                              key={problem.id}
                              onClick={() => navigate(`/problem/${problem.id}`)}
                            >
                              <td>
                                {isSolved ? (
                                  <CheckCircle2Icon className="problem-status-icon solved" />
                                ) : (
                                  <CircleIcon className="problem-status-icon unsolved" />
                                )}
                              </td>
                              <td>
                                <span className="problem-title-cell">
                                  {indexOfFirst + idx + 1}. {problem.title}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`problem-difficulty-badge ${problem.difficulty.toLowerCase()}`}
                                >
                                  {problem.difficulty}
                                </span>
                              </td>
                              <td>
                                <span className="problem-category-tag">
                                  {problem.category}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredProblems.length > ITEMS_PER_PAGE && (
                  <div className="problem-pagination">
                    <button onClick={goToPrev} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={goToNext} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemsPage;
