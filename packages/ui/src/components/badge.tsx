import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#1DBF73]/15 text-[#0f7a47]',
        secondary:
          'border-transparent bg-slate-100 text-slate-900',
        destructive:
          'border-transparent bg-rose-100 text-rose-800',
        outline: 'text-slate-700 border-slate-200',
        success: 'border-transparent bg-[#1DBF73]/10 text-[#0f7a47] border-[#1DBF73]/20',
        warning: 'border-transparent bg-amber-50 text-amber-700 border-amber-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

