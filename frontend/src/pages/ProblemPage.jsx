import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import { useParams } from "react-router";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );
        const initialCode = response.data.startCode.find(
          (sc) => sc.language === langMap[selectedLanguage]
        ).initialCode;

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode =
        problem.startCode.find((sc) => sc.language === langMap[selectedLanguage])
          ?.initialCode || "// Write your solution here";
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        language: selectedLanguage,
        code,
      });
      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal Server Error",
      });
      setLoading(false);
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        { language: selectedLanguage, code }
      );

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab("result");
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading && !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-100">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button
            className={`tab ${
              activeLeftTab === "description" ? "tab-active" : ""
            }`}
            onClick={() => setActiveLeftTab("description")}
          >
            Description
          </button>
          <button
            className={`tab ${
              activeLeftTab === "editorial" ? "tab-active" : ""
            }`}
            onClick={() => setActiveLeftTab("editorial")}
          >
            Editorial
          </button>
          <button
            className={`tab ${
              activeLeftTab === "solutions" ? "tab-active" : ""
            }`}
            onClick={() => setActiveLeftTab("solutions")}
          >
            Solutions
          </button>
          <button
            className={`tab ${
              activeLeftTab === "submissions" ? "tab-active" : ""
            }`}
            onClick={() => setActiveLeftTab("submissions")}
          >
            Submissions
          </button>
          <button
            className={`tab ${
              activeLeftTab === "chatAI" ? "tab-active" : ""
            }`}
            onClick={() => setActiveLeftTab("chatAI")}
          >
            ChatAI
          </button>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl font-bold">{problem.title}</h1>
                    <div
                      className={`badge badge-outline ${getDifficultyColor(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty.charAt(0).toUpperCase() +
                        problem.difficulty.slice(1)}
                    </div>

                    <div className="badge badge-primary">{problem.tags}</div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {problem.description}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Examples:</h3>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div
                          key={index}
                          className="bg-base-200 p-4 rounded-lg"
                        >
                          <h4 className="font-semibold mb-2">
                            Example {index + 1}:
                          </h4>
                          <div className="space-y-2 text-sm font-mono">
                            <div>
                              <strong>Input:</strong> {example.input}
                            </div>
                            <div>
                              <strong>Output:</strong> {example.output}
                            </div>
                            <div>
                              <strong>Explanation:</strong> {example.explanation}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div className="prose max-w-none">
                  <h2 className="text-lg font-semibold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {"Editorial is here for the problem"}
                  </div>
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-4">
                    {problem.referenceSolution.length > 0 ? (
                      problem.referenceSolution.map((solution, index) => (
                        <div
                          key={index}
                          className="border border-base-300 rounded-lg"
                        >
                          <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                            <h3 className="font-semibold">
                              {solution.title} - {solution.language}
                            </h3>
                          </div>
                          <div className="p-4">
                            <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        Solutions will be available after you solve the problem
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">My Submissions</h2>
                  <div className="space-y-4">
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

              {activeLeftTab === "chatAI" && (
                <div className="prose max-w-none">
                  <h2 className="text-lg font-semibold mb-4">Chat with AI</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    <ChatAi problemId={problemId} />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered bg-base-200 px-4">
          <button
            className={`tab ${activeRightTab === "code" ? "tab-active" : ""}`}
            onClick={() => setActiveRightTab("code")}
          >
            Code
          </button>
          <button
            className={`tab ${
              activeRightTab === "testcase" ? "tab-active" : ""
            }`}
            onClick={() => setActiveRightTab("testcase")}
          >
            Testcases
          </button>
          <button
            className={`tab ${activeRightTab === "result" ? "tab-active" : ""}`}
            onClick={() => setActiveRightTab("result")}
          >
            Result
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === "code" && (
            <div className="flex-1 flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <div className="flex gap-2">
                  {["javascript", "java", "cpp"].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm ${
                        selectedLanguage === lang ? "btn-primary" : "btn-ghost"
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === "cpp"
                        ? "C++"
                        : lang === "javascript"
                        ? "JavaScript"
                        : "Java"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguageForMonaco(selectedLanguage)}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: {
                      enabled: false,
                    },
                    lineNumbersMinChars: 3,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: "on",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    renderLineHighlight: "line",
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: "line",
                    mouseWheelZoom: true,
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex justify-end gap-4 border-t border-base-300">
                <button
                  className="btn btn-outline"
                  onClick={handleRun}
                  disabled={loading}
                >
                  Run
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitCode}
                  disabled={loading}
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Run Result */}
         {activeRightTab === "testcase" && (
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Testcase</h3>
                {runResult ? (
                <div className="space-y-4">
                    {/* Overall Status */}
                    <div
                    className={`p-4 rounded ${
                        runResult.accepted ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                    >
                    <p>
                        <strong>Overall Status:</strong>{" "}
                        {runResult.accepted ? "Accepted ✅" : "Wrong ❌"}
                    </p>
                    </div>

                    {/* Individual Testcases */}
                    <div className="space-y-3">
                    {runResult.testCases && runResult.testCases.length > 0 ? (
                        runResult.testCases.map((tc, idx) => (
                        <div
                            key={idx}
                            className="border rounded p-3 bg-gray-800 shadow-sm"
                        >
                            <p className="font-semibold mb-1">Testcase {idx + 1}</p>
                            <p>
                            <strong>Input:</strong> <code>{tc.stdin}</code>
                            </p>
                            <p>
                            <strong>Expected:</strong> <code>{tc.expected_output}</code>
                            </p>
                            <p>
                            <strong>Output:</strong> <code>{tc.stdout}</code>
                            </p>
                            <p>
                            <strong>Status:</strong>{" "}
                            {tc.status_id === 3 ? (
                                <span className="text-green-600">Accepted ✅</span>
                            ) : (
                                <span className="text-red-600">Wrong ❌</span>
                            )}
                            </p>
                        </div>
                        ))
                    ) : (
                        <p>No testcases available</p>
                    )}
                    </div>
                </div>
                ) : (
                <p>No testcase to run</p>
                )}
            </div>
            )}


          {/* Submit Result Output */}
          {activeRightTab === "result" && (
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">Submission Result</h3>
              {submitResult ? (
                <div
                  className= 'border rounded p-3 bg-gray-800 shadow-sm'
                >
                  <p>
                    <strong>Status:</strong>{" "}
                    {submitResult.accepted ? <span className="text-green-600">Accepted ✅</span> : <span className="text-red-600">Wrong ❌</span>}
                  </p>
                  <p>
                    <strong>Passed Test Cases:</strong> {submitResult.passedTestCases} /{" "}
                    {problem?.visibleTestCases?.length || "-"}
                  </p>
                  <p>
                    <strong>Runtime:</strong> {submitResult.runtime}s
                  </p>
                  <p>
                    <strong>Memory:</strong> {submitResult.memory} KB
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No submission result available.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
