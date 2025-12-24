interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  accentColor?: "blue" | "green" | "purple" | "orange";
}

const accentStyles = {
  blue: "bg-blue-50 text-blue-500",
  green: "bg-green-50 text-green-500",
  purple: "bg-purple-50 text-purple-500",
  orange: "bg-orange-50 text-orange-500",
};

export default function DashboardCard({
  title,
  value,
  icon,
  accentColor = "blue",
}: DashboardCardProps) {
  return (
    <div className="flex flex-col gap-2 p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
        </div>
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl ${accentStyles[accentColor]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
