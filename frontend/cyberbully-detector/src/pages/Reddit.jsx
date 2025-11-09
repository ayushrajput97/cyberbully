import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import ChartCard from "../components/ChartCard";

const COLORS = ["#00C49F", "#FF8042"];

export default function Reddit() {
  const [data, setData] = useState([
    { name: "Bullying", value: 40 },
    { name: "Non-Bullying", value: 60 },
  ]);

  // You can later fetch data like:
  // useEffect(() => {
  //   fetch("http://localhost:5001/api/reddit")
  //     .then(res => res.json())
  //     .then(data => setData(data));
  // }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Reddit Cyberbullying Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChartCard title="Bullying vs Non-Bullying Posts">
          <PieChart width={400} height={300}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="Platform Insight">
          <p className="text-gray-700 text-lg leading-relaxed">
            Analysis of Reddit posts indicates an increasing trend in online
            aggression. Around <strong>40%</strong> of comments show bullying
            behavior, while <strong>60%</strong> are neutral or supportive.
          </p>
        </ChartCard>
      </div>
    </div>
  );
}
