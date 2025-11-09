import { useEffect, useState } from "react";

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // 🎥 Fetch YouTube videos
    const API_KEY = "AIzaSyD1OG2vug1ycuTXq3iD2z2dZiMXOUYYJtw"; // replace this
    const query = "cyberbullying awareness";

    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setVideos(data.items || []))
      .catch(() => setVideos([]));

    // 🐦 Mock Tweets
    const sampleTweets = [
      { user: "TechGuru", handle: "@techguru", text: "Online kindness costs nothing 💙" },
      { user: "DigitalCare", handle: "@digitalcare", text: "Report and move on 🚫" },
      { user: "CyberSafe", handle: "@cybersafe", text: "Together for a safer web 🌍" },
      { user: "PeaceOnline", handle: "@peaceonline", text: "Think before you type ✍️" },
      { user: "MindfulNet", handle: "@mindfulnet", text: "Words can hurt ✊" },
    ];
    setTweets(sampleTweets);
  }, []);

  const doubledVideos = [...videos, ...videos];
  const doubledTweets = [...tweets, ...tweets];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2b2d77] via-[#7a5fa6] to-[#e3a6c9] text-white overflow-x-hidden overflow-y-auto relative py-10">
      {/* 🌌 Background overlay */}
      <div className="absolute inset-0 bg-[url('/color-scheme.jpeg')] bg-cover bg-center opacity-40 blur-sm"></div>

      <div className="relative z-10 flex flex-col items-center px-6 space-y-16">
        {/* 🎥 YouTube Section */}
       <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 drop-shadow-lg text-center">
            YouTube Showcase
          </h1>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 overflow-hidden">
            <div className="scroll-container">
              <div className="scroll-content">
                {doubledVideos.length > 0 ? (
                  doubledVideos.map((video, index) => (
                    <div key={index} className="video-card">
                      <iframe
                        className="rounded-lg w-full h-[200px]"
                        src={`https://www.youtube.com/embed/${video.id.videoId}`}
                        title={video.snippet.title}
                        allowFullScreen
                      ></iframe>
                      <p className="mt-2 text-sm font-semibold text-white truncate">
                        {video.snippet.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center w-full text-gray-200">Loading videos...</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 🐦 Twitter Section */}
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold mb-8 drop-shadow-lg text-center">
            Twitter Feed
          </h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 overflow-hidden">
            <div className="scroll-container">
              <div className="scroll-content tweet-style">
                {doubledTweets.map((tweet, i) => (
                  <div key={i} className="tweet-card">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-300 rounded-full mr-3"></div>
                      <div>
                        <p className="font-semibold text-white">{tweet.user}</p>
                        <p className="text-gray-300 text-sm">{tweet.handle}</p>
                      </div>
                    </div>
                    <p className="text-gray-100 text-sm">{tweet.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ Styles */}
      <style>
        {`
          /* Outer vertical scroll works normally */
          body {
            overflow-y: auto;
            overflow-x: hidden;
          }

          /* Horizontal scroll containers */
          .scroll-container {
            overflow: hidden;
            width: 100%;
            position: relative;
          }
          .scroll-content {
            display: flex;
            gap: 1.5rem;
            animation: smoothScroll 45s linear infinite;
            width: max-content;
          }
          .tweet-style {
            animation-duration: 60s;
          }
          .video-card {
            min-width: 360px;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.75rem;
            border-radius: 0.75rem;
            backdrop-filter: blur(12px);
            transition: transform 0.3s ease, background 0.3s;
          }
          .video-card:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.2);
          }
          .tweet-card {
            min-width: 300px;
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 0.75rem;
            backdrop-filter: blur(10px);
            flex-shrink: 0;
            transition: transform 0.3s;
          }
          .tweet-card:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.2);
          }
          @keyframes smoothScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .scroll-content:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
}
