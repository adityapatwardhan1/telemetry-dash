type StatusCardProps = {
  label: string;
  value: string | number;
  color?: string;
};

export default function StatusCard({
  label,
  value,
  color = "text-blue-600",
}: StatusCardProps) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow flex flex-col items-start w-full">
      <p className="text-sm text-gray-500">{label}</p>
      <h3 className={`text-2xl font-semibold ${color}`}>{value}</h3>
    </div>
  );
}
