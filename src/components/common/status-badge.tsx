import { cn } from '@/lib/utils';

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  // Event statuses
  draft:        { bg: 'bg-[#e6e8ea]',   text: 'text-[#3f4944]',  dot: 'bg-[#3f4944]/50' },
  active:       { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  ongoing:      { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  completed:    { bg: 'bg-[#eceef0]',   text: 'text-[#004532]',  dot: 'bg-[#065f46]' },
  archived:     { bg: 'bg-[#e6e8ea]',   text: 'text-[#3f4944]/60', dot: 'bg-[#3f4944]/30' },

  // Coupon statuses
  generated:    { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  claimed:      { bg: 'bg-[#6ffbbe]/30', text: 'text-[#002113]', dot: 'bg-[#006c49]' },
  voided:       { bg: 'bg-[#ffdad6]',   text: 'text-[#652925]',  dot: 'bg-[#ba1a1a]' },
  expired:      { bg: 'bg-amber-100',    text: 'text-amber-800',  dot: 'bg-amber-500' },

  // Animal statuses
  registered:   { bg: 'bg-[#e6e8ea]',   text: 'text-[#3f4944]',  dot: 'bg-[#3f4944]/50' },
  slaughtered:  { bg: 'bg-orange-100',   text: 'text-orange-800', dot: 'bg-orange-500' },
  processed:    { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  distributed:  { bg: 'bg-[#6ffbbe]/30', text: 'text-[#002113]', dot: 'bg-[#006c49]' },

  // Payment statuses
  pending:      { bg: 'bg-amber-100',    text: 'text-amber-800',  dot: 'bg-amber-500' },
  paid:         { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  failed:       { bg: 'bg-[#ffdad6]',   text: 'text-[#652925]',  dot: 'bg-[#ba1a1a]' },
  refunded:     { bg: 'bg-[#ffdad6]',   text: 'text-[#73332f]',  dot: 'bg-[#652925]' },

  // Other
  cancelled:    { bg: 'bg-[#ffdad6]',   text: 'text-[#652925]',  dot: 'bg-[#ba1a1a]' },
  suspended:    { bg: 'bg-orange-100',   text: 'text-orange-800', dot: 'bg-orange-500' },
  submitted:    { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  success:      { bg: 'bg-[#a6f2d1]',   text: 'text-[#003826]',  dot: 'bg-[#004532]' },
  already_claimed: { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  invalid:      { bg: 'bg-[#ffdad6]',   text: 'text-[#652925]',  dot: 'bg-[#ba1a1a]' },
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    bg: 'bg-[#e6e8ea]',
    text: 'text-[#3f4944]',
    dot: 'bg-[#3f4944]/50',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('size-1.5 rounded-full flex-shrink-0', config.dot)} />
      {label || status}
    </span>
  );
}
