import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  // Event statuses
  draft: 'bg-slate-100 text-slate-700',
  active: 'bg-green-100 text-green-700',
  ongoing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-gray-100 text-gray-500',

  // Coupon statuses
  generated: 'bg-blue-100 text-blue-700',
  claimed: 'bg-green-100 text-green-700',
  voided: 'bg-red-100 text-red-700',
  expired: 'bg-amber-100 text-amber-700',

  // Animal statuses
  registered: 'bg-slate-100 text-slate-700',
  slaughtered: 'bg-orange-100 text-orange-700',
  processed: 'bg-blue-100 text-blue-700',
  distributed: 'bg-green-100 text-green-700',

  // Payment statuses
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',

  // Subscription statuses
  cancelled: 'bg-red-100 text-red-700',
  suspended: 'bg-orange-100 text-orange-700',

  // Donor statuses
  submitted: 'bg-green-100 text-green-700',

  // Scan results
  success: 'bg-green-100 text-green-700',
  already_claimed: 'bg-amber-100 text-amber-700',
  invalid: 'bg-red-100 text-red-700',
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-700';

  return (
    <Badge
      variant="secondary"
      className={cn('font-medium border-0', colorClass, className)}
    >
      {label || status}
    </Badge>
  );
}
