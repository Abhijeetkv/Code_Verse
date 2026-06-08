import React, { useEffect } from "react";
import { LANGUAGE_CONFIG } from "../data/problem";
import { Loader2Icon, PlayIcon, SendIcon } from "lucide-react";
import Editor  from "@monaco-editor/react";

const CodeEditor = ({
  selectedLanguage,
  code,
  isRunning,
  isSubmitting,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onSubmitCode,
}) => {

  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme("customTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0c0c14",
        "editor.foreground": "#e8e8f0",
      },
    });
  }

  return (
    <>
      <div className="h-full flex flex-col" style={{ background: 'var(--slate-950)' }}>
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'var(--slate-900)', borderBottom: '1px solid var(--slate-800)' }}
        >
          <div className="flex items-center gap-3">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage].icon}
              alt={LANGUAGE_CONFIG[selectedLanguage].name}
              className="size-6"
            />
            <select
              className="text-sm py-1.5 px-3 rounded-lg"
              value={selectedLanguage}
              onChange={onLanguageChange}
              style={{
                background: 'var(--slate-800)',
                border: '1px solid var(--slate-700)',
                color: 'var(--slate-200)',
                outline: 'none',
              }}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([Key, lang]) => (
                <option key={Key} value={Key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn btn-sm gap-2"
              style={{
                background: 'var(--slate-700)',
                border: '1px solid var(--slate-600)',
                color: 'var(--slate-100)',
              }}
              disabled={isRunning || isSubmitting}
              onClick={onRunCode}
            >
              {isRunning ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="size-4" />
                  Run
                </>
              )}
            </button>

            <button
              className="btn btn-sm gap-2"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                border: 'none',
                color: 'white',
              }}
              disabled={isRunning || isSubmitting}
              onClick={onSubmitCode}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Judging...
                </>
              ) : (
                <>
                  <SendIcon className="size-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <Editor
            height={"100%"}
            beforeMount={handleEditorWillMount}
            language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
            value={code}
            onChange={onCodeChange}
            theme="customTheme"
            options={{
              fontSize: 16,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
