import React from 'react';
import { clsx } from 'clsx';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dense';
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  variant = 'dense',
  glow = false,
  className,
  children,
  ...rest
}) => {
  return (
    <div
      className={clsx(
        variant === 'light' ? 'glass-light' : 'glass-dense',
        glow && 'ring-1 ring-accent-cyan/30 shadow-glow-cyan',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
