import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function PromptInput({ onAnalyze, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAnalyze(text);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a comment, post, or message..."
        className="w-full max-w-2xl h-32 p-3 border rounded-xl shadow-md"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
      >
        {loading ? "Analyzing..." : <>Analyze <FiSend /></>}
      </button>
    </form>
  );
}
