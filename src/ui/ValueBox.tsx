import React from 'react';

interface ValueBoxProps {
  label: string;
  value: number;
  unit: string;
  precision?: number;
}

export const ValueBox: React.FC<ValueBoxProps> = ({
  label,
  value,
  unit,
  precision = 3,
}) => (
  <div className="flex items-baseline justify-between gap-2 text-sm">
    <span className="text-text-secondary">{label}</span>
    <span className="font-mono tabular text-text-primary">
      {value.toFixed(precision)} <span className="text-text-muted">{unit}</span>
    </span>
  </div>
);
