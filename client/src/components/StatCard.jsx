import { cn } from '../utils/cn';

export default function StatCard({ title, value, icon: Icon, trend, colorClass }) {
  return (
    <div className="glass-card p-6 flex items-start justify-between group hover:shadow-lg transition-all duration-300">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {trend && (
          <p className={cn(
            "text-sm mt-2 flex items-center font-medium",
            trend > 0 ? "text-emerald-500" : "text-red-500"
          )}>
            {trend > 0 ? '+' : ''}{trend}% from last month
          </p>
        )}
      </div>
      <div className={cn("p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110", colorClass)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}
