import React from 'react'
import { CheckCircle2Icon, XCircleIcon, AlertTriangleIcon } from 'lucide-react'

const OutputPanel = ({ output }) => {
  const hasVerdict = output?.verdict;

  return (
    <>
      <div className="h-full flex flex-col" style={{ background: 'var(--slate-950)' }}>
        <div
          className="px-4 py-2 font-semibold text-sm flex items-center justify-between"
          style={{
            background: 'var(--slate-900)',
            borderBottom: '1px solid var(--slate-800)',
            color: 'var(--slate-300)',
          }}
        >
          <span>Output</span>
          {hasVerdict && (
            <span
              className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md"
              style={{
                background:
                  output.verdict === 'accepted'
                    ? 'rgba(52, 211, 153, 0.12)'
                    : output.verdict === 'wrong'
                    ? 'rgba(244, 63, 94, 0.12)'
                    : 'rgba(251, 191, 36, 0.12)',
                color:
                  output.verdict === 'accepted'
                    ? 'var(--emerald)'
                    : output.verdict === 'wrong'
                    ? 'var(--rose)'
                    : 'var(--amber)',
                border: `1px solid ${
                  output.verdict === 'accepted'
                    ? 'rgba(52, 211, 153, 0.2)'
                    : output.verdict === 'wrong'
                    ? 'rgba(244, 63, 94, 0.2)'
                    : 'rgba(251, 191, 36, 0.2)'
                }`,
              }}
            >
              {output.verdict === 'accepted' && <CheckCircle2Icon className="w-3.5 h-3.5" />}
              {output.verdict === 'wrong' && <XCircleIcon className="w-3.5 h-3.5" />}
              {output.verdict === 'error' && <AlertTriangleIcon className="w-3.5 h-3.5" />}
              {output.verdict === 'accepted'
                ? 'Accepted'
                : output.verdict === 'wrong'
                ? 'Wrong Answer'
                : 'Error'}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          {output === null ? (
            <p className="text-sm" style={{ color: 'var(--slate-500)' }}>
              Click "Run" to see output or "Submit" to check your solution...
            </p>
          ) : hasVerdict ? (
            // Submission result
            <div className="space-y-4">
              {/* Verdict banner */}
              {output.verdict === 'accepted' && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.15)',
                  }}
                >
                  <CheckCircle2Icon className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--emerald)' }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: 'var(--emerald)' }}>
                      Accepted
                    </p>
                    <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
                      All test cases passed successfully!
                    </p>
                  </div>
                </div>
              )}

              {output.verdict === 'wrong' && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.15)',
                  }}
                >
                  <XCircleIcon className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--rose)' }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: 'var(--rose)' }}>
                      Wrong Answer
                    </p>
                    <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
                      Your output doesn't match the expected result.
                    </p>
                  </div>
                </div>
              )}

              {output.verdict === 'error' && (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(251, 191, 36, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.15)',
                  }}
                >
                  <AlertTriangleIcon className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--amber)' }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: 'var(--amber)' }}>
                      Compilation / Runtime Error
                    </p>
                    <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
                      Fix the errors and try again.
                    </p>
                  </div>
                </div>
              )}

              {/* Your Output */}
              {output.output && (
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--slate-500)' }}>
                    Your Output
                  </p>
                  <pre
                    className="text-sm font-mono whitespace-pre-wrap p-3 rounded-lg"
                    style={{
                      background: 'var(--slate-900)',
                      border: '1px solid var(--slate-800)',
                      color: 'var(--slate-200)',
                    }}
                  >
                    {output.output}
                  </pre>
                </div>
              )}

              {/* Expected Output (only on wrong answer) */}
              {output.verdict === 'wrong' && output.expectedOutput && (
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--slate-500)' }}>
                    Expected Output
                  </p>
                  <pre
                    className="text-sm font-mono whitespace-pre-wrap p-3 rounded-lg"
                    style={{
                      background: 'var(--slate-900)',
                      border: '1px solid rgba(52, 211, 153, 0.15)',
                      color: 'var(--emerald)',
                    }}
                  >
                    {output.expectedOutput}
                  </pre>
                </div>
              )}

              {/* Error output */}
              {output.error && (
                <div>
                  <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--slate-500)' }}>
                    Error
                  </p>
                  <pre
                    className="text-sm font-mono whitespace-pre-wrap p-3 rounded-lg"
                    style={{
                      background: 'var(--slate-900)',
                      border: '1px solid rgba(244, 63, 94, 0.15)',
                      color: 'var(--rose)',
                    }}
                  >
                    {output.error}
                  </pre>
                </div>
              )}
            </div>
          ) : output.success ? (
            // Plain run output
            <pre
              className="text-sm font-mono whitespace-pre-wrap"
              style={{ color: 'var(--emerald)' }}
            >
              {output.output}
            </pre>
          ) : (
            // Plain run error
            <div>
              {output.output && (
                <pre
                  className="text-sm font-mono whitespace-pre-wrap mb-2"
                  style={{ color: 'var(--slate-200)' }}
                >
                  {output.output}
                </pre>
              )}
              <pre
                className="text-sm font-mono whitespace-pre-wrap"
                style={{ color: 'var(--rose)' }}
              >
                {output.error}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default OutputPanel