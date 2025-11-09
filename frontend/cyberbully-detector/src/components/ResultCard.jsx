export default function ResultCard({ result }) {
  if (result.error) return <p className="text-red-600">{result.error}</p>;

  const { prediction, confidence } = result;
  const color = prediction === "Cyberbullying" ? "bg-red-100" : "bg-green-100";

  return (
    <div className={`mt-6 p-4 rounded-xl shadow-md ${color}`}>
      <h2 className="text-xl font-bold">
        {prediction === "Cyberbullying" ? "🚨 Cyberbullying Detected" : "✅ Safe Content"}
      </h2>
      <p className="text-gray-700 mt-2">Confidence: {(confidence * 100).toFixed(2)}%</p>
    </div>
  );
}
