import React from 'react'

const ProblemDescription = ({ problem, currentProblemId, onProblemChange, allProblems }) => {

  const getDifficultyStyle = (difficulty) => {
    const d = difficulty?.toLowerCase();
    if (d === 'easy') return { background: 'rgba(52, 211, 153, 0.1)', color: 'var(--emerald)', border: '1px solid rgba(52, 211, 153, 0.2)' };
    if (d === 'medium') return { background: 'rgba(251, 191, 36, 0.1)', color: 'var(--amber)', border: '1px solid rgba(251, 191, 36, 0.2)' };
    if (d === 'hard') return { background: 'rgba(244, 63, 94, 0.1)', color: 'var(--rose)', border: '1px solid rgba(244, 63, 94, 0.2)' };
    return {};
  };

  return (
    <>
     <div className="h-full overflow-y-auto" style={{ background: 'var(--slate-950)' }}>
        {/* Header */}
        <div
          className="p-6"
          style={{ borderBottom: '1px solid var(--slate-800)', background: 'var(--slate-900)' }}
        >
            <div className="flex items-start justify-between mb-3">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--slate-100)' }}>
                  {problem.title}
                </h1>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-md"
                  style={getDifficultyStyle(problem.difficulty)}
                >
                  {problem.difficulty}
                </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--slate-400)' }}>{problem.category}</p>

            <div className="mt-4">
              <select
                className='w-full text-sm py-2 px-3 rounded-lg'
                value={currentProblemId}
                onChange={(e) => onProblemChange(e.target.value)}
                style={{
                  background: 'var(--slate-800)',
                  border: '1px solid var(--slate-700)',
                  color: 'var(--slate-200)',
                  outline: 'none',
                }}
              >
                {allProblems.map((prob) => (
                  <option key={prob.id} value={prob.id}>
                    {prob.title} - {prob.difficulty}
                  </option>
                ))}
              </select>
            </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--slate-900)', border: '1px solid var(--slate-800)' }}
          >
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--slate-100)' }}>
              Description
            </h2>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'var(--slate-300)' }}>
              <p>{problem.description.text}</p>
              {problem.description.notes.map((note, index) => (
                <p key={index}>{note}</p>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--slate-900)', border: '1px solid var(--slate-800)' }}
          >
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--slate-100)' }}>
              Examples
            </h2>
            <div className="space-y-4">
              {problem.examples.map((example, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-bold w-5 h-5 rounded flex items-center justify-center"
                      style={{ background: 'var(--indigo-500)', color: 'white' }}
                    >
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-sm" style={{ color: 'var(--slate-200)' }}>
                      Example {idx + 1}
                    </p>
                  </div>
                  <div
                    className="rounded-lg p-4 font-mono text-sm space-y-1.5"
                    style={{ background: 'var(--slate-800)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex gap-2">
                      <span className="font-bold min-w-[70px]" style={{ color: 'var(--indigo-400)' }}>
                        Input:
                      </span>
                      <span style={{ color: 'var(--slate-200)' }}>{example.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold min-w-[70px]" style={{ color: 'var(--emerald)' }}>
                        Output:
                      </span>
                      <span style={{ color: 'var(--slate-200)' }}>{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div
                        className="pt-2 mt-2"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <span className="text-xs" style={{ color: 'var(--slate-500)' }}>
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'var(--slate-900)', border: '1px solid var(--slate-800)' }}
          >
            <h2 className="text-base font-bold mb-4" style={{ color: 'var(--slate-100)' }}>
              Constraints
            </h2>
            <ul className="space-y-2">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span style={{ color: 'var(--indigo-400)' }}>•</span>
                  <code
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--slate-800)', color: 'var(--slate-300)' }}
                  >
                    {constraint}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        </div>
     </div>
    </>
  )
}

export default ProblemDescription