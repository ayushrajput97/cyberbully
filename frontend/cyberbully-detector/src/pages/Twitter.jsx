import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import ChartCard from "../components/ChartCard";

export default function Twitter() {
  const [data, setData] = useState([
    { category: "Positive", tweets: 200 },
    { category: "Neutral", tweets: 150 },
    { category: "Bullying", tweets: 100 },
  ]);

  // Fetch from backend later:
  // useEffect(() => {
  //   fetch("http://localhost:5001/api/twitter")
  //     .then(res => res.json())
  //     .then(data => setData(data));
  // }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Twitter Cyberbullying Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard title="Tweet Sentiment Analysis">
          <BarChart width={450} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tweets" fill="#82ca9d" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Observations">
          <p className="text-gray-700 text-lg leading-relaxed">
            Twitter data reveals <strong>100 bullying tweets</strong> detected this
            week. Positive engagement is improving, but moderation on trending
            topics remains crucial.
          </p>
        </ChartCard>
      </div>
    </div>
  );
}
