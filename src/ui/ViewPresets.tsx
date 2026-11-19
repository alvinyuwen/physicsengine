import React from 'react';
import { GlassPanel } from './GlassPanel';

export type ViewPreset = 'top' | 'side' | 'front' | 'iso';

interface ViewPresetsProps {
  active: ViewPreset;
  onChange: (v: ViewPreset) => void;
}

const presets: { id: ViewPreset; label: string }[] = [
  { id: 'top', label: 'Top' },
  { id: 'side', label: 'Side' },
  { id: 'front', label: 'Front' },
  { id: 'iso', label: 'Iso' },
];

export const ViewPresets: React.FC<ViewPresetsProps> = ({ active, onChange }) => (
  <GlassPanel variant="light" className="flex gap-1 p-1">
    {presets.map((p) => (
      <button
        key={p.id}
        onClick={() => onChange(p.id)}
        className={`rounded-pill px-3 py-1 text-xs ${
          active === p.id
            ? 'bg-accent-cyan/20 text-accent-cyan'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {p.label}
      </button>
    ))}
  </GlassPanel>
);
