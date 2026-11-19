import React from 'react';
import { GlassPanel } from './GlassPanel';

interface SimLayoutProps {
  title: string;
  level: string;
  scene: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
  bottom?: React.ReactNode;
  topRight?: React.ReactNode;
  onBack?: () => void;
}

export const SimLayout: React.FC<SimLayoutProps> = ({
  title,
  level,
  scene,
  left,
  right,
  bottom,
  topRight,
  onBack,
}) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 3D scene fills viewport */}
      <div className="absolute inset-0">{scene}</div>

      {/* Top bar */}
      <GlassPanel
        variant="light"
        className="absolute left-4 right-4 top-4 flex items-center gap-3 px-4 py-2"
      >
        {onBack && (
          <button onClick={onBack} className="text-text-secondary hover:text-text-primary">
            ←
          </button>
        )}
        <h1 className="font-serif text-xl italic text-text-primary">{title}</h1>
        <span className="rounded-pill bg-accent-cyan/20 px-2 py-0.5 text-xs text-accent-cyan">
          {level}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {/* Playback controls would go here */}
          {topRight}
        </div>
      </GlassPanel>

      {/* Left panel */}
      <GlassPanel
        variant="dense"
        className="absolute bottom-4 left-4 top-20 w-80 overflow-y-auto p-4"
      >
        {left}
      </GlassPanel>

      {/* Right panel */}
      <GlassPanel
        variant="dense"
        className="absolute bottom-4 right-4 top-20 w-85 overflow-y-auto p-4"
      >
        {right}
      </GlassPanel>

      {/* Bottom strip */}
      {bottom && (
        <GlassPanel
          variant="dense"
          className="absolute bottom-4 left-1/2 w-[min(600px,60vw)] -translate-x-1/2 p-3"
        >
          {bottom}
        </GlassPanel>
      )}
    </div>
  );
};
