import { LucideIcon } from 'lucide-react';
import { motion as m } from 'motion/react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <m.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {Icon && (
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#a6f2d1]">
          <Icon className="size-8 text-[#004532]" />
        </div>
      )}
      <h3 className="font-headline text-lg font-bold text-[#191c1e]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-xs text-sm text-[#3f4944]">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-lg shadow-[#004532]/20 transition-all active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </m.div>
  );
}
