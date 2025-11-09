import { useEffect, useState } from "react";
import axios from "axios";

export default function YouTube() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoId = "TWP0YpfvGvM";
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5001/api/youtube-comments?video_id=${videoId}`
      );
      setComments(res.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-gradient-to-br from-[#ff4d4d]/60 via-[#ff7a7a]/40 to-[#ffffff]/20 backdrop-blur-lg overflow-hidden p-6">
      {/* Center content inside dashboard */}
      <div className="w-full max-w-6xl mx-auto flex flex-col">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-10 text-white drop-shadow-lg">
          YouTube Showcase
        </h1>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8">
          {/* 🎬 Video Section */}
          <div className="flex-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-5 hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-white drop-shadow">
              🎬 Featured Video
            </h2>
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl"
                src={videoUrl}
                title="YouTube video"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* 💬 Comments Section */}
          <div className="flex-1 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-5 hover:scale-[1.01] transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-white drop-shadow">
              💬 Latest Comments
            </h2>

            {loading ? (
              <p className="text-gray-200 animate-pulse">Fetching comments...</p>
            ) : comments.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-transparent">
                {comments.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white/40 backdrop-blur-sm rounded-lg shadow-sm text-gray-900"
                  >
                    <p className="font-semibold text-red-600">{c.author}</p>
                    <p className="text-gray-800">{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-100">No comments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}