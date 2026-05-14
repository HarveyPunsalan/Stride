import { useState } from "react";

function AiCoach() {
  const [report, setReport] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  function handleGenerate() {
    const token = localStorage.getItem("token");
    if (!token) return;

    setReport("");
    setIsStreaming(true);

    const apiUrl = import.meta.env.VITE_API_URL;
    const source = new EventSource(`${apiUrl}/ai/report?token=${token}`);

    source.onmessage = (event) => {
      if (event.data === "[DONE]") {
        source.close();
        setIsStreaming(false);
        return;
      }
      setReport((prev) => prev + event.data);
    };

    source.onerror = () => {
      source.close();
      setIsStreaming(false);
    };
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Career Coach</h1>
      <button
        onClick={handleGenerate}
        disabled={isStreaming}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isStreaming ? "Generating..." : "Generate Report"}
      </button>

      {report && (
        <pre className="mt-6 whitespace-pre-wrap text-sm leading-relaxed">
          {report}
        </pre>
      )}
    </div>
  );
}

export default AiCoach;
