export default function StatCard({ title, value, color }) {
  return (
    <div className={`${color} p-4 rounded-2xl shadow-md`}>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
