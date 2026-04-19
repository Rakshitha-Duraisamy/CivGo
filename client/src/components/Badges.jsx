import { cn } from '../utils/cn';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function StatusBadge({ status }) {
  const styles = {
    'Resolved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Pending': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  };

  const icons = {
    'Resolved': CheckCircle2,
    'In Progress': Clock,
    'Pending': AlertCircle,
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold", styles[status] || styles['Pending'])}>
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const styles = {
    'Low': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    'Medium': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'High': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'Critical': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-current/10", styles[priority] || styles['Low'])}>
      {priority}
    </span>
  );
}
