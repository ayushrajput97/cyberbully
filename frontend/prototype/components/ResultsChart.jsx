import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const ResultsChart = ({ results }) => {
  const summary = {
    toxic: results.filter((r) => r.prediction === "Bullying / Toxic").length,
    safe: results.filter((r) => r.prediction === "Normal / Safe").length,
  };

  const data = [
    { name: "Bullying / Toxic", value: summary.toxic },
    { name: "Normal / Safe", value: summary.safe },
  ];

  const COLORS = ["#EF4444", "#10B981"];

  return (
    <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-3 text-gray-700">Sentiment Overview</h4>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default ResultsChart;
