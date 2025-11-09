import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PromptInput from "./components/PromptInput";
import ResultCard from "./components/ResultCard";
import Dashboard from "./pages/Dashboard";
import Reddit from "./pages/Reddit";
import Twitter from "./pages/Twitter";
import Youtube from "./pages/Youtube";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Analyzer Function (unchanged)
  const handleAnalyze = async (text) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/analyze", { text });
      setResult(res.data);
    } catch (err) {
      console.error("Error connecting to backend:", err);
      setResult({ error: "Error analyzing text." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar />

          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reddit" element={<Reddit />} />
              <Route path="/twitter" element={<Twitter />} />
              <Route path="/youtube" element={<Youtube />} />

              {/* Analyze Page */}
              <Route
                path="/analyze"
                element={
                  <div className="max-w-2xl mx-auto mt-10">
                    <h1 className="text-3xl font-semibold mb-6 text-gray-800">
                      Cyberbullying Analyzer
                    </h1>
                    <PromptInput onAnalyze={handleAnalyze} loading={loading} />
                    {result && <ResultCard result={result} />}
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
