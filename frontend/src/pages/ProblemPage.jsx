import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROBLEMS } from "../data/problem";
import DashNavbar from "../components/DashNavbar";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { useParams } from "react-router-dom";
import ProblemDescription from "../components/ProblemDescription.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import { executeCode } from "../lib/piston.js";
import { toast } from "react-hot-toast";
import confetti from "canvas-confetti";
import { useProgress } from "../hooks/useProgress.js";


const ProblemPage = () => {
 const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { markProblemSolved } = useProgress(PROBLEMS);

  const currentProblem = PROBLEMS[currentProblemId];

  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    return normalizedActual == normalizedExpected;
  };

  // RUN — just execute, show raw output, no verdict
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  // SUBMIT — execute, check against expected output, mark solved
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        markProblemSolved(currentProblemId);
        toast.success("Accepted! All tests passed 🎉");
        setOutput({
          ...result,
          verdict: "accepted",
        });
      } else {
        toast.error("Wrong Answer — check your solution");
        setOutput({
          ...result,
          verdict: "wrong",
          expectedOutput: expectedOutput,
        });
      }
    } else {
      toast.error("Compilation/Runtime Error");
      setOutput({
        ...result,
        verdict: "error",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <>
    <div className="h-screen flex flex-col" style={{ background: 'var(--slate-950)' }}>
      <DashNavbar />

      <div className="flex-1 min-h-screen">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="resize-handle-h" />

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                <CodeEditor
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                />
              </Panel>

              <PanelResizeHandle className="resize-handle-v" />


              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
    </>
  );
};

export default ProblemPage;
