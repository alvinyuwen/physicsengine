import React from 'react';
import { clsx } from 'clsx';

interface SliderProps {
  label: string;
  symbol: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  onReset?: () => void;
  log?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  symbol,
  unit,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  onReset,
  log = false,
  className,
}) => {
  const id = React.useId();
  const display = Number.isFinite(value) ? value.toFixed(3) : '—';

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    if (Number.isFinite(v)) {
      onChange(Math.min(max, Math.max(min, v)));
    }
  };

  const sliderValue = log ? Math.log10(value) : value;
  const sliderMin = log ? Math.log10(min) : min;
  const sliderMax = log ? Math.log10(max) : max;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-text-secondary">
          <i className="font-serif text-text-primary">{symbol}</i>{' '}
          {label}
        </span>
        <div className="flex items-center gap-2">
          {log && (
            <span className="text-[10px] uppercase tracking-wide text-accent-cyan/70">log</span>
          )}
          <input
            id={id}
            type="number"
            className="w-24 rounded-md bg-white/5 px-2 py-1 text-right font-mono text-sm tabular text-text-primary outline-none focus:ring-2 focus:ring-accent-cyan"
            value={display}
            onChange={handleNumberChange}
            step={step}
            min={min}
            max={max}
            aria-label={`${label} (${symbol}) in ${unit}`}
          />
          <span className="w-8 text-xs text-text-muted">{unit}</span>
          {onReset && (
            <button
              onClick={onReset}
              className="text-xs text-text-muted hover:text-accent-cyan"
              aria-label={`Reset ${label}`}
            >
              ↺
            </button>
          )}
        </div>
      </div>
      <input
        type="range"
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent-cyan"
        min={sliderMin}
        max={sliderMax}
        step={log ? 0.001 : step}
        value={sliderValue}
        onChange={(e) => {
          const raw = parseFloat(e.target.value);
          onChange(log ? Math.pow(10, raw) : raw);
        }}
        aria-label={`${label} slider`}
      />
    </div>
  );
};
