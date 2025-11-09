import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResultsChart from "./ResultsChart";

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast.warn("Please enter text to analyze");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setResults((prev) => [...prev, data]);
        toast.success("Analysis complete!");
      }
    } catch (err) {
      toast.error("Error connecting to backend");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analyze Comment</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to analyze..."
        className="w-full p-3 border rounded-md mb-4"
        rows="4"
      ></textarea>

      <button
        onClick={handleAnalyze}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        Analyze
      </button>

      <ToastContainer />

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Results</h3>
          <ul className="space-y-2">
            {results.map((r, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md border">
                <p className="font-medium">{r.input_text}</p>
                <p
                  className={`mt-1 font-semibold ${
                    r.prediction === "Bullying / Toxic" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {r.prediction}
                </p>
              </li>
            ))}
          </ul>

          <ResultsChart results={results} />
        </div>
      )}
    </div>
  );
};

export default TextAnalyzer;
